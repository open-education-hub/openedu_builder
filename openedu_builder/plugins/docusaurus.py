import logging
import os
import shutil
import subprocess
from typing import Any, Mapping

from jinja2 import Environment, PackageLoader
from openedu_builder import path_utils
from openedu_builder.plugins.plugin import Plugin, PluginRunError

log = logging.getLogger(__name__)


AUTO_SIDEBAR = """const sidebars = {{
  {sidebar}: [{{type: 'autogenerated', dirName: '.'}}],
}};

module.exports = sidebars;
"""
DOCS_ONLY_FRONTMATTER = "---\nslug: /\n---\n"
DUMMY_INTRO = """# Introduction
This is a dummy introduction page required by Docusaurus. Please provide your own introduction page in the `structure` option of the `docusaurus` plugin.
"""


class DocusaurusPlugin(Plugin):
    def __init__(self, input_dir: str, output_dir: str, config: Mapping[str, Any]):
        global AUTO_SIDEBAR

        super().__init__(input_dir, output_dir, config)

        self.course_name = config.get("course_name", "Course")
        self.init_command = [
            "npx",
            "create-docusaurus@latest",
            self.course_name,
            "classic",
        ]
        self.docs_only = config.get("docs_only", True)

        self.build_command = ["npm", "run", "build"]

        self.sidebar = config.get("sidebar", "auto")
        self.sidebar_name = config.get("sidebar_name", "sidebar")
        AUTO_SIDEBAR = AUTO_SIDEBAR.format(sidebar=self.sidebar_name)
        self._parse_sidebar_options()

        self.config_template_args = self._parse_config_options()


        if config.get("init_command") is not None:
            self.init_command = config["init_command"]

    def _parse_sidebar_options(self):
        match self.sidebar:
            case "auto":
                pass
            case "custom":
                self.sidebar_location = self.config.get(
                    "sidebar_location", f"{self.input_dir}/sidebar.js"
                )
            case "js":
                self.sidebar_template_args = self._parse_sidebar_template()

    def _parse_sidebar_template(self):
        sidebar_template_args = {}

        structure = self.config["structure"]

        def parse_structure(k, v, path=""):
            retval = {}
            retval["title"] = k

            path += k + "/"

            if isinstance(v, list):
                retval["children"] = []
                for x in v:
                    retval["children"].append(
                        parse_structure(list(x.keys())[0], list(x.values())[0], path)
                    )
            else:
                retval["id"] = path + v.get("name", "index")

            return retval

        content = []
        for item in structure:
            k = list(item.keys())[0]
            v = list(item.values())[0]
            if k == "Introduction":
                continue
            content.append(parse_structure(k, v))

        sidebar_template_args["docs_only"] = self.docs_only
        sidebar_template_args["content"] = content
        sidebar_template_args["sidebar_name"] = self.sidebar_name

        return sidebar_template_args

    def _parse_config_options(self):
        config_template_args = {}

        config_template_args["docs_only"] = self.docs_only

        config_template_args["course_name"] = self.course_name
        config_template_args["logo"] = self.config.get("logo")
        config_template_args["logo_dark"] = self.config.get("logo_dark")

        config_template_args["config_meta"] = self.config.get("config_meta", {})
        config_template_args["config_socials"] = self.config.get("config_socials", {})
        config_template_args["categories"] = [
            list(x.keys())[0]
            for x in self.config.get("structure", {})
            if list(x.keys())[0] != "Introduction"
        ]
        config_template_args["copyright_string"] = self.config.get("copyright_string")

        return config_template_args

    def _create_sidebar(self):
        match self.sidebar:
            case "auto":
                with open("sidebars.js", "w") as f:
                    f.write(AUTO_SIDEBAR)
            case "custom":
                # TODO copy file
                pass
            case "js":
                with open("sidebars.js", "w") as f:
                    f.write(self._render_js_sidebar())

    def _render_js_sidebar(self):
        env = Environment(
            loader=PackageLoader("openedu_builder.plugins", "docusaurus_templates")
        )
        config_template = env.get_template("sidebar.jinja2")
        return config_template.render(**self.sidebar_template_args)

    def _copy_assets(self):
        if self.config.get("static_assets") is not None:
            for asset in self.config["static_assets"]:
                # self.input_dor is absolute
                asset_path = os.path.join(self.input_dir, asset)
                if os.path.isdir(asset_path):
                    shutil.copytree(
                        asset_path,
                        path_utils.real_join(
                            self.docusaurus_dir, "static", asset.split(os.path.sep)[-1]
                        ),
                        dirs_exist_ok=True,
                    )
                else:
                    shutil.copy(asset_path, "static")

    def _create_config(self):
        env = Environment(
            loader=PackageLoader("openedu_builder.plugins", "docusaurus_templates")
        )
        config_template = env.get_template("config.jinja2")

        with open("docusaurus.config.js", "w") as f:
            f.write(config_template.render(**self.config_template_args))

    def _organize_files(self):
        def parse_structure(k, v, path=""):
            retval = []
            path += k + "/"

            if not isinstance(v, list):
                retval.append((v["location"], path))
            else:
                for x in v:
                    retval.extend(
                        parse_structure(list(x.keys())[0], list(x.values())[0], path)
                    )

            return retval

        structure = self.config["structure"]
        to_copy = []
        for item in structure:
            k = list(item.keys())[0]
            v = list(item.values())[0]

            if k == "Introduction":
                src = parse_structure(k, v)[0][0]
                src = path_utils.real_join(self.input_dir, src)
                dst = path_utils.real_join(self.docusaurus_dir, "docs", "intro.md")
                to_copy.extend([(src, dst)])
                continue

            src, dst = parse_structure(k, v)
            src = path_utils.real_join(self.input_dir, src)
            dst = path_utils.real_join(self.docusaurus_dir, "docs", dst)
            to_copy.extend((src, dst))

        for src, dest in to_copy:
            os.makedirs(dest, exist_ok=True)
            shutil.copytree(src, dest, dirs_exist_ok=True)

    def _create_intro(self):
        # self.output_dir is absolute
        intro_path = os.path.join(self.docusaurus_dir, "docs", "intro.md")
        if not os.path.exists(intro_path):
            with open(intro_path, "w") as f:
                if self.docs_only:
                    f.write(DOCS_ONLY_FRONTMATTER)
                f.write(DUMMY_INTRO)

    def run(self):
        if self.config.get("structure") is None:
            raise PluginRunError("structure option is required for this plugin")
        logging.debug(f"Structure:\n {self.config['structure']}")

        # Run init command
        os.chdir(self.output_dir)
        p = subprocess.run(self.init_command, capture_output=True)
        if p.returncode != 0:
            log.error(f"Command {self.init_command} failed with code {p.returncode}")
            log.error(f"STDOUT: {p.stdout.decode('utf-8')}")
            log.error(f"STDERR: {p.stderr.decode('utf-8')}")
            raise PluginRunError(f"Error while running init command")

        self.docusaurus_dir = path_utils.real_join(self.output_dir, self.course_name)
        # Folders we need to delete:
        # - blog
        try:
            shutil.rmtree(path_utils.real_join(self.docusaurus_dir, "blog"))
        except FileNotFoundError:
            log.warn("Blog folder already removed")
        # - delete and recreate docs
        try:
            shutil.rmtree(path_utils.real_join(self.docusaurus_dir, "docs"))
        except FileNotFoundError:
            log.warn("Docs folder already removed")

        os.mkdir(path_utils.real_join(self.docusaurus_dir, "docs"))

        os.chdir(self.docusaurus_dir)
        # Files we need to edit:
        # - docusaurus.config.js
        self._create_config()
        # - sidebars.js
        self._create_sidebar()

        # Copy or link documentation in the right place
        self._organize_files()

        # Copy extra static assets and files
        self._copy_assets()

        # Create dummy intro if user did not provide one
        self._create_intro()

        if self.docs_only:
            try:
                os.remove("src/pages/index.js")
            except FileNotFoundError:
                log.info("index.js already removed")

        p = subprocess.run(self.build_command, capture_output=True)
        if p.returncode != 0:
            log.error(f"Command {self.build_command} failed with code {p.returncode}")
            log.error(f"STDOUT: {p.stdout.decode('utf-8')}")
            log.error(f"STDERR: {p.stderr.decode('utf-8')}")
            raise PluginRunError(f"Error while running build command")