import Helpers from "handlebars-helpers";
const helpers = Helpers();

function registerHandleBarHelpers(plop) {
  for (const prop in helpers) {
    // if it is not an already included "case" helper, than add the helper to plop
    if (!prop.toLowerCase().includes("case")) {
      plop.setHelper(prop, helpers[prop]);
    }
  }

  // overwrite "raw" helper afterwards, because it's not able to
  // avoid escaping of {{{{raw}}}} block content otherwise
  plop.setHelper("raw", (options) => {
    return options.fn(undefined);
  });
}

export default function (plop) {

  registerHandleBarHelpers(plop);

  plop.setGenerator('create', {
    description: 'Create a new UserScript',
    prompts: [
      {
        type: 'input',
        name: 'DOMAIN',
        message: 'What is domain you wanna use script on?',
        // validate: isNotEmptyFor("DOMAIN"),
        transformer: function (str) {
          return `${str.toLowerCase()}`
        },
      },
      {
        type: 'input',
        name: 'SCRIPT',
        message: 'What is name of script?',
        // validate: isNotEmptyFor("SCRIPT"),
        transformer: function (str) {
          return `${str.toLowerCase()}`
        },
      },
      {
        type: 'input',
        name: 'DESCRIPTION',
        message: 'What is short description of script?'
      },
      {
        type: 'checkbox',
        name: 'REQUIRE',
        message: 'require following js libraries:',
        choices: [
          'mousetrap',
          'mousetrap-global',
          'utils',
        ]
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/{{DOMAIN}}/{{SCRIPT}}/README.md',
        templateFile: 'templates/userscript/README.md'
      },
      {
        type: 'add',
        path: 'src/{{DOMAIN}}/{{SCRIPT}}/meta.js',
        templateFile: 'templates/userscript/meta.hbs'
      },
      {
        type: 'add',
        path: 'src/{{DOMAIN}}/{{SCRIPT}}/code.js',
        templateFile: 'templates/userscript/code.hbs'
      },
      {
        type: 'add',
        path: 'src/{{DOMAIN}}/{{SCRIPT}}/local.js',
        templateFile: 'templates/userscript/local.hbs'
      },
      {
        type: 'add',
        path: 'src/{{DOMAIN}}/{{SCRIPT}}/version.js',
        templateFile: 'templates/userscript/version.hbs'
      },
    ]
  });
};