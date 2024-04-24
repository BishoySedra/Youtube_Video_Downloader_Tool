#!/usr/bin/env node

import * as utils from "./utils.js";
import colors from "colors";

const main = async () => {
  console.log(colors.green(`Welcome to Youtube Downloader Tool!`));

  try {
    while (true) {
      const url = await utils.get_user_input();

      if (!utils.validate_url(url)) {
        console.log(
          colors.red("Invalid URL! Please enter a valid YouTube URL.")
        );
        continue;
      }

      const quality = await utils.get_video_quality();
      const format = await utils.get_video_format();
      const name = await utils.get_video_name();

      await utils.download_video(url, quality, format, name);

      const answer = await utils.to_be_continued();

      if (answer.toLowerCase() === "no" || answer.toLowerCase() === "n") {
        break;
      }
    }

    console.log(colors.green("Thank you for using Youtube Downloader Tool!"));
  } catch (error) {
    console.error(colors.red("Error:", error.message));
  }
};

main();
