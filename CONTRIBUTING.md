# Contributing

Thanks for your interest in contributing to [uploadthingui.vercel.app](https://uploadthingui.vercel.app). We're happy to have you here.

Please take a moment to review this document before submitting your first pull request. We also strongly recommend that you check for open issues and pull requests to see if someone else is working on something similar.

If you need any help, feel free to reach out to [@webdevkaleem](https://x.com/webdevkaleem).

## About this repository

---

This is a normal repo.

- We use [pnpm](https://pnpm.io/installation) and [shadcn registry](https://ui.shadcn.com/docs/registry) for development
- We use normal nextjs as our build system
- We use [absolute version](https://github.com/absolute-version/commit-and-tag-version) for automatic changelogs

## Structure

```
├── app
├── components
|   ├── example
|   ├── uploadthingui
├── contents
|   ├── blogs
|   ├── docs
└── registry
    └── new-york
        ├── common
        └── example
└── stores
|   └── main
```

| Path                       | Description                                                               |
| -------------------------- | ------------------------------------------------------------------------- |
| `app`                      | The Next.js application for the website                                   |
| `components`               | The React components for the website                                      |
| `components/uploadthingui` | The React components for uploadthingui being used in the docs for preview |
| `contents/docs`            | Markdown files for the documentation                                      |
| `contents/blogs`           | "Markdown files for the blogs                                             |
| `registry`                 | "The registry for the components                                          |
| `stores`                   | The state management stores for the components                            |

## Development

### Fork this repo

You can fork this repo by clicking the fork button in the top right corner of this page

### Clone on your local machine

```bash
git clone https://github.com/your-username/uploadthingui.git
```

### Navigate to the project directory

```bash
cd uploadthingui
```

### Create a new branch

```bash
git checkout -b my-new-branch
```

### Install dependencies

```bash
pnpm install
```

### Run the project

```bash
pnpm dev
```

### Build the project

```bash
pnpm build
```

## Components

We use shadcn registry system for developing components. You can view it's [documentation](https://ui.shadcn.com/docs/registry) for more information. In short the components are organized by styles.

```bash
└── registry
    ├── default
    │   ├── example
    │   └── ui
    └── new-york
        ├── example
        └── ui
```

When adding or modifying components, please ensure that:

- You make the changes for every style.
- You update the documentation.
- You run `pnpm registry:build` to update the registry.

## Commit Convention

Before you create a Pull Request, please check whether your commits comply with
the commit conventions used in this repository.

When you create a commit we kindly ask you to follow the convention
`category(scope or module): message` in your commit message while using one of
the following categories:

- `feat / feature`: all changes that introduce completely new code or new
  features
- `fix`: changes that fix a bug (ideally you will additionally reference an
  issue if present)
- `refactor`: any code related change that is not a fix nor a feature
- `docs`: changing existing or creating new documentation (i.e. README, docs for
  usage of a lib or cli usage)
- `build`: all changes regarding the build of the software, changes to
  dependencies or the addition of new dependencies
- `test`: all changes regarding tests (adding new tests or changing existing
  ones)
- `ci`: all changes regarding the configuration of continuous integration (i.e.
  github actions, ci system)
- `chore`: all changes to the repository that do not fit into any of the above
  categories

  e.g. `feat(components): add new prop to the avatar component`

If you are interested in the detailed specification you can visit
https://www.conventionalcommits.org/

## Requests for new components

If you have a request for a new component, please open a discussion on GitHub. We'll be happy to help you out.
