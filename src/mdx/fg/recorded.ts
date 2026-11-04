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

export interface RecordedSignature {
  dataset: 'quickstart' | 'tasks';
  method: string;
  path: string;
  requestBody: any;
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

export const RECORDED_SIGNATURES: RecordedSignature[] = [
  {
    "dataset": "quickstart",
    "method": "GET",
    "path": "/posts",
    "requestBody": null
  },
  {
    "dataset": "quickstart",
    "method": "GET",
    "path": "/posts/1",
    "requestBody": null
  },
  {
    "dataset": "quickstart",
    "method": "GET",
    "path": "/posts/999",
    "requestBody": null
  },
  {
    "dataset": "quickstart",
    "method": "GET",
    "path": "/authors",
    "requestBody": null
  },
  {
    "dataset": "quickstart",
    "method": "GET",
    "path": "/authors/2",
    "requestBody": null
  },
  {
    "dataset": "quickstart",
    "method": "GET",
    "path": "/profile",
    "requestBody": null
  },
  {
    "dataset": "quickstart",
    "method": "GET",
    "path": "/posts?views:gt=100",
    "requestBody": null
  },
  {
    "dataset": "quickstart",
    "method": "GET",
    "path": "/posts?_sort=-views",
    "requestBody": null
  },
  {
    "dataset": "quickstart",
    "method": "GET",
    "path": "/posts?_sort=views",
    "requestBody": null
  },
  {
    "dataset": "quickstart",
    "method": "GET",
    "path": "/posts?_page=1&_per_page=2",
    "requestBody": null
  },
  {
    "dataset": "quickstart",
    "method": "GET",
    "path": "/posts/1?_embed=author",
    "requestBody": null
  },
  {
    "dataset": "quickstart",
    "method": "GET",
    "path": "/authors/1?_embed=posts",
    "requestBody": null
  },
  {
    "dataset": "quickstart",
    "method": "GET",
    "path": "/posts?title=Hello%20JSON%20Server",
    "requestBody": null
  },
  {
    "dataset": "quickstart",
    "method": "GET",
    "path": "/nope",
    "requestBody": null
  },
  {
    "dataset": "quickstart",
    "method": "POST",
    "path": "/posts",
    "requestBody": {
      "title": "My first post",
      "views": 0,
      "authorId": "2"
    }
  },
  {
    "dataset": "quickstart",
    "method": "PATCH",
    "path": "/posts/1",
    "requestBody": {
      "views": 101
    }
  },
  {
    "dataset": "quickstart",
    "method": "GET",
    "path": "/posts",
    "requestBody": null
  },
  {
    "dataset": "quickstart",
    "method": "DELETE",
    "path": "/posts/3",
    "requestBody": null
  },
  {
    "dataset": "quickstart",
    "method": "GET",
    "path": "/posts/3",
    "requestBody": null
  },
  {
    "dataset": "quickstart",
    "method": "PUT",
    "path": "/posts/2",
    "requestBody": {
      "title": "Replaced",
      "views": 1,
      "authorId": "1"
    }
  },
  {
    "dataset": "quickstart",
    "method": "PATCH",
    "path": "/profile",
    "requestBody": {
      "name": "renamed"
    }
  },
  {
    "dataset": "quickstart",
    "method": "GET",
    "path": "/profile",
    "requestBody": null
  },
  {
    "dataset": "quickstart",
    "method": "PATCH",
    "path": "/posts/999",
    "requestBody": {
      "views": 1
    }
  },
  {
    "dataset": "quickstart",
    "method": "DELETE",
    "path": "/posts/999",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks/3",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks/999",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/projects",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/projects/1",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?status=open",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?status=open&priority:gte=2",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?status:ne=done",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?priority:gt=1",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?priority:lt=3",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?priority:lte=2",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?priority:eq=3",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?status:in=open,blocked",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?title:contains=release",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?title:startsWith=Set",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?status=open&status=blocked",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?_sort=-priority,title",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?_sort=priority",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?_sort=-title",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?priority=3",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?projectId=2",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?projectId=1",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?projectId:ne=1",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?projectId:gte=2",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?projectid=2",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?projectId:contains=2",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?projectId:startsWith=2",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?projectId:endsWith=2",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?projectId:in=2",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?projectId:eq=2",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?status=OPEN",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?title:contains=Release",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?priority:gte=2&priority:lte=2",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?_sort=status,-priority",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?_sort=-id",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?_page=1&_per_page=2",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?_page=2&_per_page=2",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?_page=3&_per_page=2",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?_page=9&_per_page=2",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?_per_page=1",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?_page=1",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?status=open&_page=1&_per_page=2",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?status=open&_sort=-priority&_page=1&_per_page=2",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?_sort=-priority&_page=1&_per_page=2",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?_limit=1",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?_start=0&_end=1",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?_start=1&_limit=2",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?_page=0&_per_page=2",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?_page=1&_per_page=0",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?_page=abc",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks/3?_embed=project",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/projects/2?_embed=tasks",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/projects/1?_embed=tasks",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?_embed=project",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/projects?_embed=tasks",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks/3?_embed=nothing",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "POST",
    "path": "/tasks",
    "requestBody": {
      "title": "Review pull request",
      "status": "open",
      "priority": 2,
      "projectId": "1"
    }
  },
  {
    "dataset": "tasks",
    "method": "POST",
    "path": "/tasks",
    "requestBody": {
      "id": "custom-id",
      "title": "Own id",
      "status": "open",
      "priority": 1,
      "projectId": "1"
    }
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks/custom-id",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "PATCH",
    "path": "/tasks/1",
    "requestBody": {
      "status": "done"
    }
  },
  {
    "dataset": "tasks",
    "method": "PUT",
    "path": "/tasks/4",
    "requestBody": {
      "title": "Replaced",
      "status": "open",
      "priority": 1,
      "projectId": "2"
    }
  },
  {
    "dataset": "tasks",
    "method": "DELETE",
    "path": "/tasks/5",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "DELETE",
    "path": "/projects/1",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/projects",
    "requestBody": null
  },
  {
    "dataset": "tasks",
    "method": "POST",
    "path": "/tasks",
    "requestBody": {
      "title": "Number FK",
      "status": "open",
      "priority": 1,
      "projectId": 2
    }
  },
  {
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks?projectId=2",
    "requestBody": null
  }
];
