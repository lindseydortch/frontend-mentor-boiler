import { Link } from "@tanstack/react-router";

import styles from "./attribution.module.scss";

function Attribution() {
  return (
    <div className={styles.attribution}>
      Challenge by{" "}
      <Link to="." href="https://www.frontendmentor.io?ref=challenge" target="_blank">
        Frontend Mentor
      </Link>{" "}
      | Coded by <Link to="." href="https://alorscreative.com/">Lindsey Dortch</Link>.
    </div>
  );
}

export default Attribution;
