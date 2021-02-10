import path from "path";

import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { CheckBox, CheckBoxOutlineBlank } from "@material-ui/icons";

import useSetupStore from "../SetupStore";
import { fetchLastRelease } from "../actions/github";

const useStyles = makeStyles((theme) => ({
  instructions: {
    margin: "0.2rem",
    marginBottom: "1rem",
    fontSize: "1.3rem",
  },
  button: {
    marginInline: 10,
  },
}));

export default function ShowUpdate({ selectedAsset, setSelectedAsset }) {
  const setVersion = useSetupStore((state) => state.setVersion);
  const [assets, setAssets] = useState(undefined);
  const loading = useSetupStore((state) => state.loading);

  useEffect(() => {
    fetchLastRelease().then((result) => {
      if (result === null) return;
      setVersion(result.version);
      setAssets(result.assets);
    });
  }, [setVersion]);

  const classes = useStyles();

  return (
    <Box>
      {assets && (
        <>
          <Typography className={classes.instructions}>
            Choose the version you want to use
          </Typography>
          {assets.map((asset, index) => {
            const assetDetails = path.parse(asset.name);
            if (assetDetails.ext !== ".xdelta") return undefined;

            const assetName = assetDetails.name;

            return (
              <Button
                className={classes.button}
                disabled={loading}
                color="primary"
                variant="contained"
                key={index}
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
