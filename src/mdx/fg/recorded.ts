/**
 * Generated lightweight subset of fixtures for client-side MDX components.
 * Run `node scripts/fg-generate-subset.mjs` to regenerate.
 * DO NOT import full fixtures.json in client components.
 */

export interface RecordedPreset {
  label: string;
  scenario: string;
  dataset: 'quickstart' | 'tasks';
  method: string;
  path: string;
  requestBody: any;
  status: number;
  responseBody: any;
}

export const INITIAL_DATASETS = {
  "quickstart": {
    "posts": [
      {
        "id": "1",
        "title": "Hello JSON Server",
        "views": 100,
        "authorId": "1"
      },
      {
        "id": "2",
        "title": "Filtering and sorting",
        "views": 250,
        "authorId": "1"
      },
      {
        "id": "3",
        "title": "Pagination basics",
        "views": 40,
        "authorId": "2"
      }
    ],
    "authors": [
      {
        "id": "1",
        "name": "Ada"
      },
      {
        "id": "2",
        "name": "Linus"
      }
    ],
    "profile": {
      "name": "demo"
    }
  },
  "tasks": {
    "projects": [
      {
        "id": "1",
        "name": "Website relaunch"
      },
      {
        "id": "2",
        "name": "Mobile app"
      }
    ],
    "tasks": [
      {
        "id": "1",
        "title": "Draft homepage copy",
        "status": "open",
        "priority": 2,
        "projectId": "1"
      },
      {
        "id": "2",
        "title": "Design navigation",
        "status": "done",
        "priority": 3,
        "projectId": "1"
      },
      {
        "id": "3",
        "title": "Set up CI",
        "status": "open",
        "priority": 3,
        "projectId": "2"
      },
      {
        "id": "4",
        "title": "Write release notes",
        "status": "open",
        "priority": 1,
        "projectId": "2"
      },
      {
        "id": "5",
        "title": "Fix login bug",
        "status": "blocked",
        "priority": 3,
        "projectId": "2"
      }
    ]
  }
} as const;

export const RECORDED_PRESETS: RecordedPreset[] = [
  {
    "label": "Get all posts",
    "scenario": "quickstart-reads",
    "dataset": "quickstart",
    "method": "GET",
    "path": "/posts",
    "requestBody": null,
    "status": 200,
    "responseBody": [
      {
        "id": "1",
        "title": "Hello JSON Server",
        "views": 100,
        "authorId": "1"
      },
      {
        "id": "2",
        "title": "Filtering and sorting",
        "views": 250,
        "authorId": "1"
      },
      {
        "id": "3",
        "title": "Pagination basics",
        "views": 40,
        "authorId": "2"
      }
    ]
  },
  {
    "label": "Get single post",
    "scenario": "quickstart-reads",
    "dataset": "quickstart",
    "method": "GET",
    "path": "/posts/1",
    "requestBody": null,
    "status": 200,
    "responseBody": {
      "id": "1",
      "title": "Hello JSON Server",
      "views": 100,
      "authorId": "1"
    }
  },
  {
    "label": "Filter posts by views",
    "scenario": "quickstart-reads",
    "dataset": "quickstart",
    "method": "GET",
    "path": "/posts?views:gt=100",
    "requestBody": null,
    "status": 200,
    "responseBody": [
      {
        "id": "2",
        "title": "Filtering and sorting",
        "views": 250,
        "authorId": "1"
      }
    ]
  },
  {
    "label": "Sort posts descending",
    "scenario": "quickstart-reads",
    "dataset": "quickstart",
    "method": "GET",
    "path": "/posts?_sort=-views",
    "requestBody": null,
    "status": 200,
    "responseBody": [
      {
        "id": "2",
        "title": "Filtering and sorting",
        "views": 250,
        "authorId": "1"
      },
      {
        "id": "1",
        "title": "Hello JSON Server",
        "views": 100,
        "authorId": "1"
      },
      {
        "id": "3",
        "title": "Pagination basics",
        "views": 40,
        "authorId": "2"
      }
    ]
  },
  {
    "label": "Embed author on post",
    "scenario": "quickstart-reads",
    "dataset": "quickstart",
    "method": "GET",
    "path": "/posts/1?_embed=author",
    "requestBody": null,
    "status": 200,
    "responseBody": {
      "id": "1",
      "title": "Hello JSON Server",
      "views": 100,
      "authorId": "1",
      "author": {
        "id": "1",
        "name": "Ada"
      }
    }
  },
  {
    "label": "Filter tasks by status",
    "scenario": "tasks-filter-sort",
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?status=open",
    "requestBody": null,
    "status": 200,
    "responseBody": [
      {
        "id": "1",
        "title": "Draft homepage copy",
        "status": "open",
        "priority": 2,
        "projectId": "1"
      },
      {
        "id": "3",
        "title": "Set up CI",
        "status": "open",
        "priority": 3,
        "projectId": "2"
      },
      {
        "id": "4",
        "title": "Write release notes",
        "status": "open",
        "priority": 1,
        "projectId": "2"
      }
    ]
  },
  {
    "label": "Combined filter: status and priority",
    "scenario": "tasks-filter-sort",
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?status=open&priority:gte=2",
    "requestBody": null,
    "status": 200,
    "responseBody": [
      {
        "id": "1",
        "title": "Draft homepage copy",
        "status": "open",
        "priority": 2,
        "projectId": "1"
      },
      {
        "id": "3",
        "title": "Set up CI",
        "status": "open",
        "priority": 3,
        "projectId": "2"
      }
    ]
  },
  {
    "label": "Multi-key sort: priority and title",
    "scenario": "tasks-filter-sort",
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?_sort=-priority,title",
    "requestBody": null,
    "status": 200,
    "responseBody": [
      {
        "id": "2",
        "title": "Design navigation",
        "status": "done",
        "priority": 3,
        "projectId": "1"
      },
      {
        "id": "5",
        "title": "Fix login bug",
        "status": "blocked",
        "priority": 3,
        "projectId": "2"
      },
      {
        "id": "3",
        "title": "Set up CI",
        "status": "open",
        "priority": 3,
        "projectId": "2"
      },
      {
        "id": "1",
        "title": "Draft homepage copy",
        "status": "open",
        "priority": 2,
        "projectId": "1"
      },
      {
        "id": "4",
        "title": "Write release notes",
        "status": "open",
        "priority": 1,
        "projectId": "2"
      }
    ]
  },
  {
    "label": "Quirk: string FK filter returns empty",
    "scenario": "tasks-filter-sort",
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?projectId=2",
    "requestBody": null,
    "status": 200,
    "responseBody": []
  },
  {
    "label": "Workaround: contains operator on FK",
    "scenario": "tasks-filter-sort",
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?projectId:contains=2",
    "requestBody": null,
    "status": 200,
    "responseBody": [
      {
        "id": "3",
        "title": "Set up CI",
        "status": "open",
        "priority": 3,
        "projectId": "2"
      },
      {
        "id": "4",
        "title": "Write release notes",
        "status": "open",
        "priority": 1,
        "projectId": "2"
      },
      {
        "id": "5",
        "title": "Fix login bug",
        "status": "blocked",
        "priority": 3,
        "projectId": "2"
      }
    ]
  },
  {
    "label": "Paginate tasks: page 1",
    "scenario": "tasks-paginate-embed",
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?_page=1&_per_page=2",
    "requestBody": null,
    "status": 200,
    "responseBody": {
      "first": 1,
      "prev": null,
      "next": 2,
      "last": 3,
      "pages": 3,
      "items": 5,
      "data": [
        {
          "id": "1",
          "title": "Draft homepage copy",
          "status": "open",
          "priority": 2,
          "projectId": "1"
        },
        {
          "id": "2",
          "title": "Design navigation",
          "status": "done",
          "priority": 3,
          "projectId": "1"
        }
      ]
    }
  },
  {
    "label": "Legacy _limit returns empty",
    "scenario": "tasks-paginate-embed",
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?_limit=1",
    "requestBody": null,
    "status": 200,
    "responseBody": []
  },
  {
    "label": "Embed children on project",
    "scenario": "tasks-paginate-embed",
    "dataset": "tasks",
    "method": "GET",
    "path": "/projects/2?_embed=tasks",
    "requestBody": null,
    "status": 200,
    "responseBody": {
      "id": "2",
      "name": "Mobile app",
      "tasks": [
        {
          "id": "3",
          "title": "Set up CI",
          "status": "open",
          "priority": 3,
          "projectId": "2"
        },
        {
          "id": "4",
          "title": "Write release notes",
          "status": "open",
          "priority": 1,
          "projectId": "2"
        },
        {
          "id": "5",
          "title": "Fix login bug",
          "status": "blocked",
          "priority": 3,
          "projectId": "2"
        }
      ]
    }
  },
  {
    "label": "Create post (POST)",
    "scenario": "quickstart-write",
    "dataset": "quickstart",
    "method": "POST",
    "path": "/posts",
    "requestBody": {
      "title": "My first post",
      "views": 0,
      "authorId": "2"
    },
    "status": 201,
    "responseBody": {
      "title": "My first post",
      "views": 0,
      "authorId": "2",
      "id": "<generated>"
    }
  },
  {
    "label": "Delete parent (DELETE)",
    "scenario": "tasks-write",
    "dataset": "tasks",
    "method": "DELETE",
    "path": "/projects/1",
    "requestBody": null,
    "status": 200,
    "responseBody": {
      "id": "1",
      "name": "Website relaunch"
    }
  }
];
