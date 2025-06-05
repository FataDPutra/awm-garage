import React from "react";
import { Image, X } from "lucide-react";
import Compressor from "compressorjs";
import heic2any from "heic2any";

const PhotoUpload = ({
    data,
    setData,
    photoPreviews,
    setPhotoPreviews,
    formErrors,
    handleFileChange,
    handleRemovePhoto,
}) => {
    // Deteksi browser Chrome
    const isChrome =
        /Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent);

    const convertHeicToJpeg = async (file) => {
        try {
            console.log(
                `Mengkonversi ${file.name} dari HEIC/HEIF ke JPEG menggunakan heic2any`
            );
            const convertedBlob = await heic2any({
                blob: file,
                toType: "image/jpeg",
                quality: 0.8,
            });
            const convertedFile = new File(
                [convertedBlob],
                file.name.replace(/\.(heic|heif)$/i, ".jpg"),
                { type: "image/jpeg", lastModified: new Date().getTime() }
            );
            console.log(
                `Konversi berhasil: ${convertedFile.name}, ukuran: ${convertedFile.size} bytes`
            );
            return convertedFile;
        } catch (err) {
            console.error(
                `Gagal mengkonversi ${file.name} dengan heic2any:`,
                err
            );
            throw new Error(`Gagal mengkonversi ${file.name} ke JPEG.`);
        }
    };

    const compressAndUpload = (file) => {
        new Compressor(file, {
            quality: 0.8,
            maxWidth: 1024,
            maxHeight: 1024,
            mimeType: "image/jpeg",
            success(compressedFile) {
                console.log(
                    `File ${file.name} berhasil dikompresi ke JPEG, ukuran: ${compressedFile.size} bytes`
                );
                const newPhotos = [...data.photos, compressedFile];
                setData("photos", newPhotos);
                setPhotoPreviews([
                    ...photoPreviews,
                    URL.createObjectURL(compressedFile),
                ]);
            },
            error(err) {
                console.error(`Gagal mengompresi file ${file.name}:`, err);
                alert(
                    `Gagal mengompresi file ${file.name}: ${err.message}. Jika menggunakan Chrome, konversi file HEIC ke JPEG secara manual menggunakan alat seperti Preview (Mac) atau konverter online.`
                );
            },
        });
    };

    const handleFileChangeInternal = async (e) => {
        const files = Array.from(e.target.files);
        for (const file of files) {
            const validTypes = [
                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/gif",
                "image/heic",
                "image/heif", // Tambahkan image/heif
            ];
            console.log(
                `File: ${file.name}, MIME type: ${file.type}, Size: ${file.size} bytes`
            );
            if (!validTypes.includes(file.type)) {
                console.warn(
                    `File ${file.name} ditolak: MIME type ${file.type} tidak valid.`
                );
                alert(
                    `File ${file.name} tidak valid. Hanya gambar (JPEG, PNG, JPG, GIF, HEIC, HEIF) yang diperbolehkan.`
                );
                continue;
            }

            let processedFile = file;

            if (file.type === "image/heic" || file.type === "image/heif") {
                try {
                    processedFile = await convertHeicToJpeg(file);
                } catch (err) {
                    alert(
                        `Gagal memproses file ${file.name}. Jika menggunakan Chrome, konversi file HEIC ke JPEG secara manual menggunakan alat seperti Preview (Mac) atau konverter online.`
                    );
                    continue;
                }
            }

            compressAndUpload(processedFile);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block font-semibold text-gray-700 flex items-center">
                <Image size={20} className="mr-2 text-blue-500" /> Unggah Foto
            </label>
            <p className="text-gray-600 text-sm mb-2">
                Kirim foto barang Anda yang ingin diproses (jpg, png, gif, heic,
                heif)
            </p>
            <input
                type="file"
                multiple
                className="w-full border p-3 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                accept="image/jpeg,image/png,image/jpg,image/gif,image/heic,image/heif"
                onChange={handleFileChangeInternal}
            />
            {isChrome && (
                <p className="text-sm text-yellow-600 mt-2">
                    Catatan: Chrome mungkin tidak mendukung file HEIC. Jika
                    gagal, konversi file HEIC ke JPEG menggunakan alat seperti
                    Preview (Mac) atau konverter online.
                </p>
            )}
            <div className="flex flex-wrap gap-4 mt-2">
                {photoPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                        <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-28 h-28 object-cover rounded-lg shadow"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemovePhoto(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
            {formErrors.photos && (
                <p className="text-red-500 text-sm">{formErrors.photos}</p>
            )}
        </div>
    );
};

export default PhotoUpload;
