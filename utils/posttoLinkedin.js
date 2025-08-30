const axios = require("axios");








async function postToLinkedIn(post, user) {
  const accessToken = user.linkedinAccessToken;
  const author = `urn:li:person:${user.linkedinId}`;
  let asset = null;

  // If image provided, upload to LinkedIn
  if (post.imageUrl) {
    const registerRes = await axios.post(
      "https://api.linkedin.com/v2/assets?action=registerUpload",
      {
        registerUploadRequest: {
          owner: author,
          recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
          serviceRelationships: [
            {
              identifier: "urn:li:userGeneratedContent",
              relationshipType: "OWNER",
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const uploadUrl =
      registerRes.data.value.uploadMechanism[
        "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
      ].uploadUrl;

    asset = registerRes.data.value.asset;

    // Upload image
    const imageRes = await axios.get(post.imageUrl, { responseType: "arraybuffer" });
    await axios.put(uploadUrl, imageRes.data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "image/png", // adjust if jpg
      },
    });
  }

  // Create post
  const postRes = await axios.post(
    "https://api.linkedin.com/v2/ugcPosts",
    {
      author,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: `${post.content}\n\n${Array.isArray(post.hashtags) ? post.hashtags.join(" ") : post.hashtags || ""}`,
          },
          shareMediaCategory: asset ? "IMAGE" : "NONE",
          media: asset
            ? [
                {
                  status: "READY",
                  description: { text: post.title },
                  media: asset,
                  title: { text: post.title },
                },
              ]
            : [],
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return postRes.data;
}

module.exports = postToLinkedIn;
