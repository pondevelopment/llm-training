﻿const { definePlugin } = require("html-validate");
const noTailwindColorUtilities = require("./htmlvalidate-rules/no-tailwind-color-utilities");
const noInlineColor = require("./htmlvalidate-rules/no-inline-color");
const noTopLevelHeadings = require("./htmlvalidate-rules/no-top-level-headings");

module.exports = definePlugin({
  name: "repo",
  rules: {
    "repo/no-tailwind-color-utilities": noTailwindColorUtilities,
    "repo/no-inline-color": noInlineColor,
    "repo/no-top-level-headings": noTopLevelHeadings
  }
});
