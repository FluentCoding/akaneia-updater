import Container from "@material-ui/core/Container";
import makeStyles from "@material-ui/styles/makeStyles";
const Showdown = require("showdown");

const useStyles = makeStyles((theme) => ({}));

export default function ShowUpdate() {
  const classes = useStyles();
  const converter = new Showdown.Converter({ headerLevelStart: 3 });
  converter.setFlavor("github");
  const text =
    "Bug fix update which resolves many game-breaking issues.\r\n\r\n# General\r\n- fixed Slippi Online desync issues with vanilla Melee.\r\n\r\n# Wolf\r\n- Fixed bug where using laser would desync on Slippi during rollbacks.\r\n- Fixed bug where aerial shine hitbox was active for 3 frames instead of 1 frame.\r\n- Saturated alternate costume colors.\r\n\r\n# Volleyball\r\n- Adjusted net collision. Net interactions should now be more refined.\r\n- Fixed bug where hitting the ball on your 5th hit while it was over the net gave you a point.\r\n- Projectiles that cross the net are now forcibly destroyed (Links' boomerangs).\r\n\r\n# Other\r\n- Fixed progressive mode crash.\r\n- Fixed single player crash.\r\n- Fixed title screen crash.";
  const update = converter.makeHtml(text);

  return (
    <Container>
      <h2>Akaneia Build v0.51</h2>
      <p dangerouslySetInnerHTML={{ __html: update }} />
    </Container>
  );
}
