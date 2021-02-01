import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#5CDC86'
    },
    error: {
      main: '#B23A48'
    }
  },
})

export default theme;