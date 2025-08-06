import React from "react";
// Import the original mapper
import MDXComponents from "@theme-original/MDXComponents";
import CodeBlock from "@theme/CodeBlock";
import Terminal from "@site/src/components/Terminal";
import BrowserWindow from "@site/src/components/BrowserWindow";
import Kustomization from "@site/src/components/Kustomization";
import LaunchButton from "@site/src/components/LaunchButton";
import YamlFile, { YamlAnnotation } from "@site/src/components/YamlFile";
import ReactPlayer from "react-player";
import ConsoleButton from "@site/src/components/ConsoleButton";
import SidebarWidget from "@site/src/components/SidebarWidget";

export default {
  // Re-use the default mapping
  ...MDXComponents,

  CodeBlock: CodeBlock,
  Terminal: Terminal,
  Browser: BrowserWindow,
  Kustomization: Kustomization,
  LaunchButton: LaunchButton,
  ReactPlayer: ReactPlayer,
  YamlFile: YamlFile,
  YamlAnnotation: YamlAnnotation,
  ConsoleButton: ConsoleButton,
  SidebarWidget: SidebarWidget,
};
