import React, { useState, useEffect } from "react";
import makeStyles from "@material-ui/styles/makeStyles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import path from "path";
import { CheckBox, CheckBoxOutlineBlank } from "@material-ui/icons";
import useSetupStore from "../SetupStore";
import { fetchReleases } from "../util/GithubUtil";

const useStyles = makeStyles((theme) => ({
  instructions: {
    margin: "0.2rem",
    marginBottom: "1rem",
    fontSize: "1.3rem",
  },
}));

export default function ShowUpdate({ selectedAsset, setSelectedAsset }) {
  const setVersion = useSetupStore((state) => state.setVersion);
  const [assets, setAssets] = useState(undefined);
  const loading = useSetupStore((state) => state.loading);

  useEffect(async () => {
    const result = await fetchReleases();

    setVersion(result.version);
    setAssets(result.assets);
  }, []);

  const classes = useStyles();

  return (
    <Box>
      {assets && (
        <>
          <Typography className={classes.instructions}>
            Choose the version you want to use
          </Typography>
          {assets.map((asset) => {
            var assetDetails = path.parse(asset.name);
            if (assetDetails.ext !== ".xdelta") return;

            var assetName = assetDetails.name;

            return (
              <Button
                disabled={loading}
                color="primary"
                variant="contained"
                style={{ marginRight: 10 }}
                startIcon={
                  selectedAsset?.downloadUrl === asset.browser_download_url ? (
                    <CheckBox />
                  ) : (
                    <CheckBoxOutlineBlank />
                  )
                }
                onClick={() => {
                  if (selectedAsset?.downloadUrl === asset.browser_download_url)
                    setSelectedAsset(undefined);
                  else
                    setSelectedAsset({
                      downloadUrl: asset.browser_download_url,
                      name: assetName,
                    });
                }}
              >
                {assetName}
              </Button>
            );
          })}
        </>
      )}
    </Box>
  );
}
