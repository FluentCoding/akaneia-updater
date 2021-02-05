import { Octokit } from "@octokit/core";

export const fetchReleases = async () => {
  try {
    const octokit = new Octokit();
    const asyncResponse = await octokit.request(
      "GET /repos/{owner}/{repo}/releases/latest",
      {
        owner: "akaneia",
        repo: "akaneia-build",
      }
    );

    const data = asyncResponse.data;
    return {
      version: data.tag_name,
      assets: data.assets,
    };
  } catch (err) {
    console.error(err);
  }
};
