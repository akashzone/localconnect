const mongoose = require("mongoose");
const readline = require("readline");
const path = require("path");

// Load environment variables from the server directory
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const connectDB = require("../config/db");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const BusinessProfile = require("../models/BusinessProfile");
const Project = require("../models/Project");
const Application = require("../models/Application");
const Review = require("../models/Review");
const Message = require("../models/Message");

// Helper to ask for confirmation
const askConfirmation = () => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("\nType RESET to confirm and execute: ", (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
};

const run = async () => {
  const isDryRun = process.argv.includes("--dry-run");

  try {
    if (!process.env.MONGO_URI) {
      console.error("Error: MONGO_URI env variable is not defined.");
      process.exit(1);
    }

    // Connect to database
    await connectDB();
    console.log("Database connection established.");

    // 1. Collect statistics
    const adminCountBefore = await User.countDocuments({ role: "admin" });
    const studentCountBefore = await User.countDocuments({ role: "student" });
    const businessCountBefore = await User.countDocuments({ role: "business" });
    
    // Find related test user IDs
    const testUsers = await User.find({ role: { $in: ["student", "business"] } }).select("_id");
    const testUserIds = testUsers.map((u) => u._id);

    const studentProfileCount = await StudentProfile.countDocuments({ userId: { $in: testUserIds } });
    const businessProfileCount = await BusinessProfile.countDocuments({ userId: { $in: testUserIds } });
    const projectCount = await Project.countDocuments();
    const applicationCount = await Application.countDocuments();
    const reviewCount = await Review.countDocuments();
    const messageCount = await Message.countDocuments();

    console.log("\n========================================");
    console.log("      LOCALCONNECT DATABASE RESET       ");
    console.log("========================================");
    console.log(`Admin users to PRESERVE:       ${adminCountBefore}`);
    console.log("----------------------------------------");
    console.log(`Student users to delete:       ${studentCountBefore}`);
    console.log(`Business users to delete:      ${businessCountBefore}`);
    console.log(`Student profiles to delete:    ${studentProfileCount}`);
    console.log(`Business profiles to delete:   ${businessProfileCount}`);
    console.log(`Projects to delete:            ${projectCount}`);
    console.log(`Applications to delete:        ${applicationCount}`);
    console.log(`Reviews to delete:             ${reviewCount}`);
    console.log(`Messages to delete:            ${messageCount}`);
    console.log("========================================");

    if (isDryRun) {
      console.log("\n[DRY RUN] No deletion was performed. Exiting safely.");
      mongoose.connection.close();
      process.exit(0);
    }

    // 2. Require confirmation
    const confirmation = await askConfirmation();
    if (confirmation !== "RESET") {
      console.log("\nReset aborted. No changes made.");
      mongoose.connection.close();
      process.exit(0);
    }

    console.log("\nExecuting database reset...");

    // 3. Detect transaction capability dynamically
    let useTransaction = false;
    let session = null;

    try {
      session = await mongoose.startSession();
      session.startTransaction();
      // Test rollbacks capability
      await session.abortTransaction();
      useTransaction = true;
      console.log("MongoDB transaction support detected. Running atomically...");
    } catch (err) {
      useTransaction = false;
      console.log("MongoDB transactions not supported on this setup. Falling back to sequential execution...");
    } finally {
      if (session) {
        session.endSession();
      }
    }

    if (useTransaction) {
      session = await mongoose.startSession();
      session.startTransaction();
    }

    const options = useTransaction ? { session } : {};

    try {
      // 4. Perform deletions
      await User.deleteMany({ role: { $in: ["student", "business"] } }, options);
      await StudentProfile.deleteMany({ userId: { $in: testUserIds } }, options);
      await BusinessProfile.deleteMany({ userId: { $in: testUserIds } }, options);
      await Project.deleteMany({}, options);
      await Application.deleteMany({}, options);
      await Review.deleteMany({}, options);
      await Message.deleteMany({}, options);

      // Verify admin count before committing
      const adminCountAfter = await User.countDocuments({ role: "admin" }).session(useTransaction ? session : null);
      if (adminCountAfter !== adminCountBefore) {
        throw new Error(
          `Security violation: Admin user count changed from ${adminCountBefore} to ${adminCountAfter}. Aborting reset.`
        );
      }

      if (useTransaction) {
        await session.commitTransaction();
      }
      console.log("Data deleted successfully.");
    } catch (dbError) {
      if (useTransaction) {
        await session.abortTransaction();
      }
      throw dbError;
    } finally {
      if (useTransaction && session) {
        session.endSession();
      }
    }

    // 5. Post-reset verification
    const adminCountFinal = await User.countDocuments({ role: "admin" });
    const studentCountFinal = await User.countDocuments({ role: "student" });
    const businessCountFinal = await User.countDocuments({ role: "business" });
    const studentProfileCountFinal = await StudentProfile.countDocuments();
    const businessProfileCountFinal = await BusinessProfile.countDocuments();
    const projectCountFinal = await Project.countDocuments();
    const applicationCountFinal = await Application.countDocuments();
    const reviewCountFinal = await Review.countDocuments();
    const messageCountFinal = await Message.countDocuments();

    console.log("\n========================================");
    console.log("            RESET COMPLETED             ");
    console.log("========================================");
    console.log(`Admin users preserved:         ${adminCountFinal}`);
    console.log("----------------------------------------");
    console.log(`Students:                      ${studentCountFinal}`);
    console.log(`Businesses:                    ${businessCountFinal}`);
    console.log(`StudentProfiles:               ${studentProfileCountFinal}`);
    console.log(`BusinessProfiles:              ${businessProfileCountFinal}`);
    console.log(`Projects:                      ${projectCountFinal}`);
    console.log(`Applications:                  ${applicationCountFinal}`);
    console.log(`Reviews:                       ${reviewCountFinal}`);
    console.log(`Messages:                      ${messageCountFinal}`);
    console.log("========================================");
    console.log("\nDatabase is ready for fresh test data.");
    console.log("\n[NOTE] MongoDB test data has been cleared.");
    console.log("Any external files stored in Cloudinary (e.g. resumes, profile pictures) remain untouched.");
    console.log("Please perform manual Cloudinary maintenance if necessary.");

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("\nError performing database reset:", error.message);
    if (mongoose.connection.readyState !== 0) {
      mongoose.connection.close();
    }
    process.exit(1);
  }
};

run();
