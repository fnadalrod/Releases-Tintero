import React from "react";
import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
  },

  commonMargins: {
    marginTop: 25,
    marginBottom: 25
  },

  header: {
    height: 50,
    textAlign: "left",
    paddingLeft: 20,
    paddingBottom: 10,
    paddingTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    borderBottomWidth: 1,
  },
  viewTitle: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    marginLeft: 0,
    paddingLeft: 0,
    marginBottom: 25,
  },
  inputGroup: {
    flex: 1,
    padding: 0,
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  input: {
    marginTop: 10,
    marginBottom: 10,
    border: 1
  },
  loading: {
    textAlign: "center",
    marginTop: "50%",
  },
  centerText: {
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
  },
});

export default Styles;
