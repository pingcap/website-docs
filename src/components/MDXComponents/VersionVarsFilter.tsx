import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link, Trans, useI18next } from "gatsby-plugin-react-i18next";
import { Container, Autocomplete, TextField, ToggleButtonGroup, ToggleButton, Card, CardContent, Chip, Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { MDLink } from "./MDLink";

type ScopeType = "SESSION" | "GLOBAL" | "BOTH";

export function VersionVarsFilter(props: {
    versions: string;
    children?: React.FC[];
  }) {

  const [startVersion, setStartVersion] = React.useState<string>("");
  const [endVersion, setEndVersion] = React.useState<string>("");

  const {
    versions = "",
    children = [],
  } = props;

  const versionArray = versions.split(",");

  const compareVersions = (ver1: string, ver2: string) => {
    if (ver1.startsWith("v")) {
      ver1 = ver1.substring(1);
    }

    if (ver2.startsWith("v")) {
      ver2 = ver2.substring(1);
    }

    const ver1Array = ver1.split(".");
    const ver2Array = ver2.split(".");

    if (ver1Array.length !== 3 || ver2Array.length !== 3) {
      console.log(ver1, ver2);
      throw new Error("Version format is incorrect");
    }

    for (let i = 0; i < ver1Array.length; i++) {
      if (parseInt(ver1Array[i]) > parseInt(ver2Array[i])) {
        return 1;
      } else if (parseInt(ver1Array[i]) < parseInt(ver2Array[i])) {
        return -1;
      }
    }
    return 0;
  }

  versionArray.sort((a, b) => -compareVersions(a, b));

  const MIN_VERSION = "v0.0.0";
  const MAX_VERSION = "v999.999.999";
  const filterVersion = (versions: string[], includeEqual: boolean, left?: string|null, right?: string|null) => {
    return versions.filter((version) => {
      if (left === undefined || left === null || left === "") {
        left = MIN_VERSION;
      }

      if (right === undefined || right === null || right === "") {
        right = MAX_VERSION;
      }

      let leftCompare = compareVersions(version, left);
      let rightCompare = compareVersions(right, version);
      let standard = includeEqual ? 0 : 1;

      return leftCompare >= standard && rightCompare >= standard;
    });
  }

  const filterVersionVars = (children: any[]) => {
    if (!Array.isArray(children)) {
      children = [children];
    }

    return children.map((child) => {
      if (child.props?.mdxType !== VersionVars.name) {
        // It's not of the filter scope, skip it.
        return child;
      }

      if (startVersion === "" || endVersion === "") {
        // No version is selected, skip it.
        return <VersionVars {...child.props} />;
      }

      let introducedVersion = child.props.introducedVersion;
      if (!introducedVersion) {
        introducedVersion = "v0.0.1";
      }

      if (compareVersions(startVersion!, introducedVersion) <= 0 &&
        compareVersions(introducedVersion, endVersion!) <= 0) {
        return (
          <VersionVars {...child.props} />
        )
      }

      return "";
    });
  }

  return (
    <div>
      <Stack
        id="search-area"
        direction="row"
        alignItems="center"
        sx={{
          width: "100%",
          justifyContent: "space-between",
          flexDirection: {
            xs: "column-reverse",
            md: "row",
          },
        }}
        >
          <Stack
            id="compare-filter"
            direction="row"
            alignItems="center"
            >
            <div><Trans i18nKey={`versionFilter.diffLabel`}/></div>
            <Autocomplete
              disablePortal
              id="start-version"
              value={startVersion}
              options={filterVersion(versionArray, false, MIN_VERSION, endVersion)}
              sx={{ width: 200, margin: 1 }}
              onChange={(_, newVersion) => {
                setStartVersion(newVersion ? newVersion : "")
              }}
              renderInput={(params) => <TextField {...params} label={<Trans i18nKey={`versionFilter.diffModeOlderVersion`}/>} />}
            />

            <Autocomplete
              disablePortal
              id="end-version"
              value={endVersion}
              options={filterVersion(versionArray, false, startVersion, MAX_VERSION)}
              sx={{ width: 200, margin: 1 }}
              onChange={(_, newVersion) => {setEndVersion(newVersion ? newVersion : "")}}
              renderInput={(params) => <TextField {...params} label={<Trans i18nKey={`versionFilter.diffModeNewerVersion`}/>} />}
            />
          </Stack>
      </Stack>

      <Stack
        id="vars-area"
        direction="column"
        sx={{
          width: "100%",
          justifyContent: "space-between",
          flexDirection: {
            xs: "column-reverse",
            md: "column",
          },
        }}
        >
        {filterVersionVars(children)}
      </Stack>
    </div>
  );
}


export function VersionVars(props: {
    name: string;
    scope: ScopeType;
    type?: string;
    applyHint: string;
    defaultValue: string;
    persists?: string;
    introducedVersion?: string;
    possibleValues?: string;
    range?: string;
    unit?: string;
    children?: any;
  }) {

  const INIT_VERSION = "v0.0.1"
  const {
    name = "",
    introducedVersion = INIT_VERSION,
    scope = "GLOBAL",
    type = "",
    applyHint = "false",
    defaultValue = "",
    children = [],
    possibleValues = "",
    range = "",
    unit = "",
  } = props;

  const yesOrNoI18n = (value: string) => {
    return value === "true" ? <Trans i18nKey={`versionFilter.yes`}/> : <Trans i18nKey={`versionFilter.no`}/>;
  }

  return (
    <Stack sx={{ minWidth: 275, flexShrink: 0, width: "100%", marginTop: "20px"}}>
        <Stack direction="column" spacing={1}>
          <Stack direction="row" spacing={1}>
            <Typography variant="h4" component="div" color="black"> <a id={name} href={"#"+name}>{name}</a> </Typography>
            <Stack direction="row" spacing={1} sx={{alignItems: "center"}}>
              {scope === "SESSION" || scope === "BOTH" ? <Chip label="SESSION" size="small" color="primary" /> : null}
              {scope === "GLOBAL" || scope === "BOTH" ? <Chip label="GLOBAL" size="small" color="success" /> : null}
            </Stack>
          </Stack>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            { introducedVersion === INIT_VERSION ?
              <Trans i18nKey={`versionFilter.introducedInitVersion`}/> :
              <Trans i18nKey={`versionFilter.introducedVersion`} values={{version: introducedVersion}}/> }
          </Typography>
          {type === "" ? "" : <Typography> <Trans i18nKey={`versionFilter.type`}/> {type} </Typography>}
          {props.persists === undefined ? "" : <Typography> <Trans i18nKey={`versionFilter.persists`}/> {yesOrNoI18n(props.persists)}</Typography>}
          <Typography> <Trans i18nKey={`versionFilter.hintSetVar`} components={[<MDLink url="/optimizer-hints#set_varvar_namevar_value"/>]}/> {yesOrNoI18n(applyHint)} </Typography>
          <Typography> <Trans i18nKey={`versionFilter.default`}/> {defaultValue} </Typography>
          {range === "" ? "" : <Typography> <Trans i18nKey={`versionFilter.range`}/> {range} </Typography>}
          {possibleValues === "" ? "" : <Typography> <Trans i18nKey={`versionFilter.possibleValues`}/> {possibleValues} </Typography>}
          {unit === "" ? "" : <Typography> <Trans i18nKey={`versionFilter.unit`}/> {unit} </Typography>}
        </Stack>

        {children}
    </Stack>
  );
}