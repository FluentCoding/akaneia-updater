import { Octokit } from "@octokit/core";

export async function fetchLastRelease() {
  try {
    const octokit = new Octokit();
    const asyncResponse = await octokit.request(
      "GET /repos/{owner}/{repo}/releases/latest",
      {
        owner: "ananas-dev",
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
}
