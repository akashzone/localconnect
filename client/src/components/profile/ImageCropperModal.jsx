import Cropper from "react-easy-crop";
import { CloseIcon, RotateIcon } from "../project/SpinnerIcon";

function ImageCropperModal({
  imageSrc,
  crop,
  zoom,
  rotation,
  uploading,
  onCropChange,
  onZoomChange,
  onRotationChange,
  onCropComplete,
  onClose,
  onSave,
}) {
  if (!imageSrc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white border border-[#D8D2C4] rounded-[6px] w-full max-w-md shadow-[6px_6px_0px_#1B2430] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#D8D2C4] px-6 py-4 bg-[#FAF8F3]">
          <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430]">
            Edit profile photo
          </h3>

          <button
            onClick={onClose}
            className="text-[#9B9384] hover:text-[#1B2430] transition-colors"
            title="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="relative w-full h-80 bg-gray-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onRotationChange={onRotationChange}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="p-6 space-y-5 bg-[#FAF8F3] border-t border-[#D8D2C4]">
          <div className="space-y-2">
            <div className="flex justify-between items-center font-['IBM_Plex_Mono'] text-xs text-[#6B6459]">
              <span>Zoom</span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>

            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-label="Zoom"
              onChange={(e) => onZoomChange(Number(e.target.value))}
              className="w-full h-1.5 bg-[#D8D2C4] rounded-lg appearance-none cursor-pointer accent-[#0F6B5C]"
            />
          </div>

          <div className="flex justify-start">
            <button
              type="button"
              onClick={() => onRotationChange((prev) => (prev + 90) % 360)}
              className="flex items-center gap-2 font-['IBM_Plex_Mono'] text-[12px] font-semibold px-3 py-1.5 border-2 border-[#1B2430] bg-white text-[#1B2430] rounded-[4px] shadow-[2px_2px_0px_#1B2430] hover:shadow-[1px_1px_0px_#1B2430] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150"
            >
              <RotateIcon />
              Rotate 90°
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#D8D2C4] bg-white">
          <button
            onClick={onClose}
            className="font-semibold text-sm px-4 py-2.5 rounded-[4px] border-2 border-[#1B2430] text-[#1B2430] hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors duration-150"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            disabled={uploading}
            className="font-semibold text-sm px-4 py-2.5 rounded-[4px] bg-[#1B2430] text-[#FAF8F3] shadow-[3px_3px_0px_#F5C445] hover:shadow-[1px_1px_0px_#F5C445] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 disabled:opacity-50"
          >
            {uploading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageCropperModal;
