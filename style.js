import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  card: {
    width: "800px",
    padding: theme.spacing(3),
    textAlign: "center",
  },
  progressBarContainer: {
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
    margin: "20px 0",
  },
  progressBar: {
    height: 20,
    backgroundColor: "#3f51b5",
    transition: "width 0.3s ease-in-out",
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
}));