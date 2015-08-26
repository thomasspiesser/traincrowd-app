Slingshot.fileRestrictions("coursePicture", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
  maxSize: 5 * 1024 * 1024 // 10 MB (use null for unlimited)
});

Slingshot.fileRestrictions("profilePicture", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
  maxSize: 5 * 1024 * 1024 // 10 MB (use null for unlimited)
});