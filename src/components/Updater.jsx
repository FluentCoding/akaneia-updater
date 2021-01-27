import React, { useState, useEffect, useRef } from "react";
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { Octokit } from '@octokit/core';
import makeStyles from '@material-ui/styles/makeStyles';
const Showdown = require('showdown');

const useStyles = makeStyles((theme) => ({
}));

export default function ShowUpdate() {
  const componentIsMounted = useRef(true);
  const [releaseName, setReleaseName] = useState("");
  const [releaseBody, setReleaseBody] = useState("");

  useEffect(() => {
    // each useEffect can return a cleanup function
    return () => {
      componentIsMounted.current = false;
    };
  }); // no extra deps => the cleanup function run this on component unmount
    useEffect(() => {
      async function fetchReleases() {
        try {
          const octokit = new Octokit();
          const asyncResponse = await octokit.request('GET /repos/{owner}/{repo}/releases', {
            owner: 'akaneia',
            repo: 'akaneia-build'
          })
          const data = asyncResponse.data[0];
          const converter = new Showdown.Converter({headerLevelStart: 3});
          converter.setFlavor('github')

          console.log(data)

          setReleaseName(data.name)
          setReleaseBody(converter.makeHtml(data.body))

          if (componentIsMounted.current) {
            console.log(data);
          }
        } catch (err) {
          console.error(err);
        }
      }
    fetchReleases();
  });


  const classes = useStyles();

  return (
    <Container>
      <Paper className={classes.updateLogs}>
        <h2>
          {releaseName}
        </h2>
        <p dangerouslySetInnerHTML={{__html: releaseBody}} />
      </Paper>
    </Container>
  );
}