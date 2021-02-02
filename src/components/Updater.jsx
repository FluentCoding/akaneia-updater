import React, { useState, useEffect, useRef } from "react";
import { Octokit } from "@octokit/core";
import makeStyles from "@material-ui/styles/makeStyles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import path from "path";
import { CheckBox, CheckBoxOutlineBlank } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  instructions: {
    margin: "0.2rem",
    marginBottom: "1rem",
    fontSize: "1.3rem",
  },
}));

export default function ShowUpdate({ selectedAsset, setSelectedAsset }) {
  //const [version, setVersion] = useState(undefined);
  const [assets, setAssets] = useState(undefined);

  useEffect(() => {
    async function fetchReleases() {
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
        console.log(data.assets)
        setAssets(data.assets);
      } catch (err) {
        console.error(err);
      }
    }
    fetchReleases();
  }, []);

  const classes = useStyles();

  return (
    <Box>
      {assets && (
        <>
          <Typography className={classes.instructions}>
            Choose the version you want to use
          </Typography>
          {assets.map((asset, key) => (
            <Button
              color="primary"
              variant="contained"
              style={{ marginRight: 10 }}
              startIcon={selectedAsset === key ? <CheckBox /> : <CheckBoxOutlineBlank />}
              onClick={() => {
                if (selectedAsset === key)
                  setSelectedAsset(undefined);
                else
                  setSelectedAsset(key);
                console.log(asset.browser_download_url);
              }}
            >
              {path.basename(asset.name, ".xdelta")}
            </Button>
          ))}
        </>
      )}
    </Box>
  );
}
