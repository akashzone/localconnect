const jwt = require("jsonwebtoken");
const axios = require("axios");

const JWT_SECRET = "localconnect_secret_key_2026_safe_fallback_random_string";
const BASE_URL = "http://localhost:5000/api/admin";

async function runTests() {
  console.log("Starting HTTP-only API tests...");

  try {
    // Generate a temporary admin token to query existing database users
    const tempAdminToken = jwt.sign(
      { id: "60c72b2f9b1d8b2bad000000", role: "admin" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const makeRequest = async (url, token, params = {}) => {
      const headers = token ? { Cookie: `accessToken=${token}` } : {};
      const response = await axios.get(url, { headers, params, validateStatus: () => true });
      return response;
    };

    // Fetch existing users from the system
    console.log("Fetching users from system via admin endpoint...");
    const usersRes = await makeRequest(`${BASE_URL}/users`, tempAdminToken, { limit: 100 });
    if (usersRes.status !== 200) {
      throw new Error(`Failed to fetch users to get test IDs: status ${usersRes.status}. Output: ${JSON.stringify(usersRes.data)}`);
    }

    const allUsers = usersRes.data.data || [];
    const studentUser = allUsers.find(u => u.role === "student");
    const businessUser = allUsers.find(u => u.role === "business");
    const adminUser = allUsers.find(u => u.role === "admin") || { _id: "60c72b2f9b1d8b2bad000000" };

    if (!studentUser || !businessUser) {
      console.log("Warning: Could not find both a student and a business user in the database. Tests will proceed with mock IDs.");
    }

    const studentId = studentUser ? studentUser._id : "60c72b2f9b1d8b2bad000001";
    const businessId = businessUser ? businessUser._id : "60c72b2f9b1d8b2bad000002";
    const adminId = adminUser._id;

    console.log(`Using Student ID: ${studentId}`);
    console.log(`Using Business ID: ${businessId}`);
    console.log(`Using Admin ID: ${adminId}`);

    // Generate accurate tokens
    const studentToken = jwt.sign({ id: studentId, role: "student" }, JWT_SECRET, { expiresIn: "1h" });
    const businessToken = jwt.sign({ id: businessId, role: "business" }, JWT_SECRET, { expiresIn: "1h" });
    const adminToken = jwt.sign({ id: adminId, role: "admin" }, JWT_SECRET, { expiresIn: "1h" });

    console.log("\n--- RUNNING ASSERTIONS ---");

    // Test 1: Logged-out request receives 401
    console.log("Test 1: Unauthenticated request to /reviews...");
    const res1 = await makeRequest(`${BASE_URL}/reviews`, null);
    console.log(`Status: ${res1.status} (Expected: 401)`);
    if (res1.status !== 401) throw new Error("Unauthenticated request test failed");

    // Test 2: Student receives 403
    console.log("Test 2: Student request to /reviews...");
    const res2 = await makeRequest(`${BASE_URL}/reviews`, studentToken);
    console.log(`Status: ${res2.status} (Expected: 403)`);
    if (res2.status !== 403) throw new Error("Student role check failed");

    // Test 3: Business receives 403
    console.log("Test 3: Business request to /reviews...");
    const res3 = await makeRequest(`${BASE_URL}/reviews`, businessToken);
    console.log(`Status: ${res3.status} (Expected: 403)`);
    if (res3.status !== 403) throw new Error("Business role check failed");

    // Test 4: Admin can fetch reviews (200)
    console.log("Test 4: Admin request to /reviews...");
    const res4 = await makeRequest(`${BASE_URL}/reviews`, adminToken);
    console.log(`Status: ${res4.status} (Expected: 200)`);
    console.log(`Data success: ${res4.data?.success}, reviews count: ${res4.data?.data?.length}`);
    if (res4.status !== 200 || !res4.data?.success) throw new Error("Admin fetch reviews failed");

    // Test 5: Search works
    console.log("Test 5: Search filter works...");
    const res5 = await makeRequest(`${BASE_URL}/reviews`, adminToken, { search: "test" });
    console.log(`Status: ${res5.status}, results: ${res5.data?.data?.length}`);
    if (res5.status !== 200) throw new Error("Search filter failed");

    // Test 6: Filters work (rating and role)
    console.log("Test 6: Star rating and reviewerRole filters work...");
    const res6 = await makeRequest(`${BASE_URL}/reviews`, adminToken, { rating: 5, reviewerRole: "student" });
    console.log(`Status: ${res6.status}, results count: ${res6.data?.data?.length}`);
    if (res6.status !== 200) throw new Error("Filters failed");

    // Test 7: Pagination works
    console.log("Test 7: Pagination works...");
    const res7 = await makeRequest(`${BASE_URL}/reviews`, adminToken, { page: 1, limit: 1 });
    console.log(`Status: ${res7.status}, pagination details:`, res7.data?.pagination);
    if (res7.status !== 200 || res7.data?.pagination?.limit !== 1) throw new Error("Pagination failed");

    // Retrieve a seeded review if any exists
    const reviewsList = res4.data?.data || [];
    if (reviewsList.length > 0) {
      const targetReview = reviewsList[0];
      
      // Test 8: Valid review ID returns 200
      console.log(`Test 8: Valid review ID details fetch (${targetReview._id})...`);
      const res8 = await makeRequest(`${BASE_URL}/reviews/${targetReview._id}`, adminToken);
      console.log(`Status: ${res8.status} (Expected: 200)`);
      if (res8.status !== 200 || !res8.data?.success) throw new Error("Valid review fetch details failed");

      // Test 11: Passwords/secrets are never returned
      console.log("Test 11: Security check for passwords/secrets in populated users...");
      const reviewData = res8.data?.data;
      const studentUserObj = reviewData?.studentId;
      const businessUserObj = reviewData?.businessOwnerId;
      if (studentUserObj && (studentUserObj.password || studentUserObj.hash)) {
        throw new Error("Security leak: student password exposed!");
      }
      if (businessUserObj && (businessUserObj.password || businessUserObj.hash)) {
        throw new Error("Security leak: business owner password exposed!");
      }
      console.log("Security check passed. No passwords or hashes found.");
    } else {
      console.log("Skipping details/security check as no reviews exist in the DB.");
    }

    // Test 9: Invalid ObjectId returns 400
    console.log("Test 9: Invalid ObjectId fetch details...");
    const res9 = await makeRequest(`${BASE_URL}/reviews/invalid_id_123`, adminToken);
    console.log(`Status: ${res9.status} (Expected: 400)`);
    if (res9.status !== 400) throw new Error("Invalid ObjectId test failed");

    // Test 10: Nonexistent review returns 404
    console.log("Test 10: Nonexistent review ID fetch details...");
    const nonexistentId = "60c72b2f9b1d8b2bad000099";
    const res10 = await makeRequest(`${BASE_URL}/reviews/${nonexistentId}`, adminToken);
    console.log(`Status: ${res10.status} (Expected: 404)`);
    if (res10.status !== 404) throw new Error("Nonexistent review test failed");

    console.log("\n--- ALL BACKEND TESTS PASSED SUCCESSFULLY! ---");

  } catch (error) {
    console.error("\nTEST RUN FAILED:", error);
  }
}

runTests();
