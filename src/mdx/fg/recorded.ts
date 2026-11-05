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

export interface RecordedResponseItem {
  method: string;
  status: number;
  body: any;
  fixtureId: string;
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
    "label": "Embed parent on task",
    "scenario": "tasks-paginate-embed",
    "dataset": "tasks",
    "method": "GET",
    "path": "/tasks/3?_embed=project",
    "requestBody": null,
    "status": 200,
    "responseBody": {
      "id": "3",
      "title": "Set up CI",
      "status": "open",
      "priority": 3,
      "projectId": "2",
      "project": {
        "id": "2",
        "name": "Mobile app"
      }
    }
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

export const VALID_FIXTURE_IDS: string[] = [
  "quickstart-reads#0",
  "quickstart-reads[0]",
  "quickstart-reads#1",
  "quickstart-reads[1]",
  "quickstart-reads#2",
  "quickstart-reads[2]",
  "quickstart-reads#3",
  "quickstart-reads[3]",
  "quickstart-reads#4",
  "quickstart-reads[4]",
  "quickstart-reads#5",
  "quickstart-reads[5]",
  "quickstart-reads#6",
  "quickstart-reads[6]",
  "quickstart-reads#7",
  "quickstart-reads[7]",
  "quickstart-reads#8",
  "quickstart-reads[8]",
  "quickstart-reads#9",
  "quickstart-reads[9]",
  "quickstart-reads#10",
  "quickstart-reads[10]",
  "quickstart-reads#11",
  "quickstart-reads[11]",
  "quickstart-reads#12",
  "quickstart-reads[12]",
  "quickstart-reads#13",
  "quickstart-reads[13]",
  "quickstart-write#0",
  "quickstart-write[0]",
  "quickstart-write#1",
  "quickstart-write[1]",
  "quickstart-write#2",
  "quickstart-write[2]",
  "quickstart-write#3",
  "quickstart-write[3]",
  "quickstart-write#4",
  "quickstart-write[4]",
  "quickstart-write#5",
  "quickstart-write[5]",
  "quickstart-write#6",
  "quickstart-write[6]",
  "quickstart-write#7",
  "quickstart-write[7]",
  "quickstart-write#8",
  "quickstart-write[8]",
  "quickstart-write#9",
  "quickstart-write[9]",
  "tasks-filter-sort#0",
  "tasks-filter-sort[0]",
  "tasks-filter-sort#1",
  "tasks-filter-sort[1]",
  "tasks-filter-sort#2",
  "tasks-filter-sort[2]",
  "tasks-filter-sort#3",
  "tasks-filter-sort[3]",
  "tasks-filter-sort#4",
  "tasks-filter-sort[4]",
  "tasks-filter-sort#5",
  "tasks-filter-sort[5]",
  "tasks-filter-sort#6",
  "tasks-filter-sort[6]",
  "tasks-filter-sort#7",
  "tasks-filter-sort[7]",
  "tasks-filter-sort#8",
  "tasks-filter-sort[8]",
  "tasks-filter-sort#9",
  "tasks-filter-sort[9]",
  "tasks-filter-sort#10",
  "tasks-filter-sort[10]",
  "tasks-filter-sort#11",
  "tasks-filter-sort[11]",
  "tasks-filter-sort#12",
  "tasks-filter-sort[12]",
  "tasks-filter-sort#13",
  "tasks-filter-sort[13]",
  "tasks-filter-sort#14",
  "tasks-filter-sort[14]",
  "tasks-filter-sort#15",
  "tasks-filter-sort[15]",
  "tasks-filter-sort#16",
  "tasks-filter-sort[16]",
  "tasks-filter-sort#17",
  "tasks-filter-sort[17]",
  "tasks-filter-sort#18",
  "tasks-filter-sort[18]",
  "tasks-filter-sort#19",
  "tasks-filter-sort[19]",
  "tasks-filter-sort#20",
  "tasks-filter-sort[20]",
  "tasks-filter-sort#21",
  "tasks-filter-sort[21]",
  "tasks-filter-sort#22",
  "tasks-filter-sort[22]",
  "tasks-filter-sort#23",
  "tasks-filter-sort[23]",
  "tasks-filter-sort#24",
  "tasks-filter-sort[24]",
  "tasks-filter-sort#25",
  "tasks-filter-sort[25]",
  "tasks-filter-sort#26",
  "tasks-filter-sort[26]",
  "tasks-filter-sort#27",
  "tasks-filter-sort[27]",
  "tasks-filter-sort#28",
  "tasks-filter-sort[28]",
  "tasks-filter-sort#29",
  "tasks-filter-sort[29]",
  "tasks-filter-sort#30",
  "tasks-filter-sort[30]",
  "tasks-filter-sort#31",
  "tasks-filter-sort[31]",
  "tasks-filter-sort#32",
  "tasks-filter-sort[32]",
  "tasks-filter-sort#33",
  "tasks-filter-sort[33]",
  "tasks-filter-sort#34",
  "tasks-filter-sort[34]",
  "tasks-paginate-embed#0",
  "tasks-paginate-embed[0]",
  "tasks-paginate-embed#1",
  "tasks-paginate-embed[1]",
  "tasks-paginate-embed#2",
  "tasks-paginate-embed[2]",
  "tasks-paginate-embed#3",
  "tasks-paginate-embed[3]",
  "tasks-paginate-embed#4",
  "tasks-paginate-embed[4]",
  "tasks-paginate-embed#5",
  "tasks-paginate-embed[5]",
  "tasks-paginate-embed#6",
  "tasks-paginate-embed[6]",
  "tasks-paginate-embed#7",
  "tasks-paginate-embed[7]",
  "tasks-paginate-embed#8",
  "tasks-paginate-embed[8]",
  "tasks-paginate-embed#9",
  "tasks-paginate-embed[9]",
  "tasks-paginate-embed#10",
  "tasks-paginate-embed[10]",
  "tasks-paginate-embed#11",
  "tasks-paginate-embed[11]",
  "tasks-paginate-embed#12",
  "tasks-paginate-embed[12]",
  "tasks-paginate-embed#13",
  "tasks-paginate-embed[13]",
  "tasks-paginate-embed#14",
  "tasks-paginate-embed[14]",
  "tasks-paginate-embed#15",
  "tasks-paginate-embed[15]",
  "tasks-paginate-embed#16",
  "tasks-paginate-embed[16]",
  "tasks-paginate-embed#17",
  "tasks-paginate-embed[17]",
  "tasks-paginate-embed#18",
  "tasks-paginate-embed[18]",
  "tasks-paginate-embed#19",
  "tasks-paginate-embed[19]",
  "tasks-paginate-embed#20",
  "tasks-paginate-embed[20]",
  "tasks-write#0",
  "tasks-write[0]",
  "tasks-write#1",
  "tasks-write[1]",
  "tasks-write#2",
  "tasks-write[2]",
  "tasks-write#3",
  "tasks-write[3]",
  "tasks-write#4",
  "tasks-write[4]",
  "tasks-write#5",
  "tasks-write[5]",
  "tasks-write#6",
  "tasks-write[6]",
  "tasks-write#7",
  "tasks-write[7]",
  "tasks-write#8",
  "tasks-write[8]",
  "tasks-write#9",
  "tasks-write[9]",
  "tasks-write#10",
  "tasks-write[10]"
];

export const RECORDED_RESPONSES: Record<string, RecordedResponseItem> = {
  "quickstart:/posts": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "1",
        "title": "Hello JSON Server",
        "views": 101,
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
      },
      {
        "title": "My first post",
        "views": 0,
        "authorId": "2",
        "id": "<generated>"
      }
    ],
    "fixtureId": "quickstart-write#2"
  },
  "/posts": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "1",
        "title": "Hello JSON Server",
        "views": 101,
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
      },
      {
        "title": "My first post",
        "views": 0,
        "authorId": "2",
        "id": "<generated>"
      }
    ],
    "fixtureId": "quickstart-write#2"
  },
  "quickstart:/posts/1": {
    "method": "GET",
    "status": 200,
    "body": {
      "id": "1",
      "title": "Hello JSON Server",
      "views": 100,
      "authorId": "1"
    },
    "fixtureId": "quickstart-reads#1"
  },
  "/posts/1": {
    "method": "GET",
    "status": 200,
    "body": {
      "id": "1",
      "title": "Hello JSON Server",
      "views": 100,
      "authorId": "1"
    },
    "fixtureId": "quickstart-reads#1"
  },
  "quickstart:/posts/999": {
    "method": "GET",
    "status": 404,
    "body": {
      "error": "Not Found"
    },
    "fixtureId": "quickstart-reads#2"
  },
  "/posts/999": {
    "method": "GET",
    "status": 404,
    "body": {
      "error": "Not Found"
    },
    "fixtureId": "quickstart-reads#2"
  },
  "quickstart:/authors": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "1",
        "name": "Ada"
      },
      {
        "id": "2",
        "name": "Linus"
      }
    ],
    "fixtureId": "quickstart-reads#3"
  },
  "/authors": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "1",
        "name": "Ada"
      },
      {
        "id": "2",
        "name": "Linus"
      }
    ],
    "fixtureId": "quickstart-reads#3"
  },
  "quickstart:/authors/2": {
    "method": "GET",
    "status": 200,
    "body": {
      "id": "2",
      "name": "Linus"
    },
    "fixtureId": "quickstart-reads#4"
  },
  "/authors/2": {
    "method": "GET",
    "status": 200,
    "body": {
      "id": "2",
      "name": "Linus"
    },
    "fixtureId": "quickstart-reads#4"
  },
  "quickstart:/profile": {
    "method": "GET",
    "status": 200,
    "body": {
      "name": "renamed"
    },
    "fixtureId": "quickstart-write#7"
  },
  "/profile": {
    "method": "GET",
    "status": 200,
    "body": {
      "name": "renamed"
    },
    "fixtureId": "quickstart-write#7"
  },
  "quickstart:/posts?views:gt=100": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "2",
        "title": "Filtering and sorting",
        "views": 250,
        "authorId": "1"
      }
    ],
    "fixtureId": "quickstart-reads#6"
  },
  "/posts?views:gt=100": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "2",
        "title": "Filtering and sorting",
        "views": 250,
        "authorId": "1"
      }
    ],
    "fixtureId": "quickstart-reads#6"
  },
  "quickstart:/posts?_sort=-views": {
    "method": "GET",
    "status": 200,
    "body": [
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
    ],
    "fixtureId": "quickstart-reads#7"
  },
  "/posts?_sort=-views": {
    "method": "GET",
    "status": 200,
    "body": [
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
    ],
    "fixtureId": "quickstart-reads#7"
  },
  "quickstart:/posts?_sort=views": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "3",
        "title": "Pagination basics",
        "views": 40,
        "authorId": "2"
      },
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
      }
    ],
    "fixtureId": "quickstart-reads#8"
  },
  "/posts?_sort=views": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "3",
        "title": "Pagination basics",
        "views": 40,
        "authorId": "2"
      },
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
      }
    ],
    "fixtureId": "quickstart-reads#8"
  },
  "quickstart:/posts?_page=1&_per_page=2": {
    "method": "GET",
    "status": 200,
    "body": {
      "first": 1,
      "prev": null,
      "next": 2,
      "last": 2,
      "pages": 2,
      "items": 3,
      "data": [
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
        }
      ]
    },
    "fixtureId": "quickstart-reads#9"
  },
  "/posts?_page=1&_per_page=2": {
    "method": "GET",
    "status": 200,
    "body": {
      "first": 1,
      "prev": null,
      "next": 2,
      "last": 2,
      "pages": 2,
      "items": 3,
      "data": [
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
        }
      ]
    },
    "fixtureId": "quickstart-reads#9"
  },
  "quickstart:/posts/1?_embed=author": {
    "method": "GET",
    "status": 200,
    "body": {
      "id": "1",
      "title": "Hello JSON Server",
      "views": 100,
      "authorId": "1",
      "author": {
        "id": "1",
        "name": "Ada"
      }
    },
    "fixtureId": "quickstart-reads#10"
  },
  "/posts/1?_embed=author": {
    "method": "GET",
    "status": 200,
    "body": {
      "id": "1",
      "title": "Hello JSON Server",
      "views": 100,
      "authorId": "1",
      "author": {
        "id": "1",
        "name": "Ada"
      }
    },
    "fixtureId": "quickstart-reads#10"
  },
  "quickstart:/authors/1?_embed=posts": {
    "method": "GET",
    "status": 200,
    "body": {
      "id": "1",
      "name": "Ada",
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
        }
      ]
    },
    "fixtureId": "quickstart-reads#11"
  },
  "/authors/1?_embed=posts": {
    "method": "GET",
    "status": 200,
    "body": {
      "id": "1",
      "name": "Ada",
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
        }
      ]
    },
    "fixtureId": "quickstart-reads#11"
  },
  "quickstart:/posts?title=Hello%20JSON%20Server": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "1",
        "title": "Hello JSON Server",
        "views": 100,
        "authorId": "1"
      }
    ],
    "fixtureId": "quickstart-reads#12"
  },
  "/posts?title=Hello%20JSON%20Server": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "1",
        "title": "Hello JSON Server",
        "views": 100,
        "authorId": "1"
      }
    ],
    "fixtureId": "quickstart-reads#12"
  },
  "quickstart:/nope": {
    "method": "GET",
    "status": 404,
    "body": {
      "error": "Not Found"
    },
    "fixtureId": "quickstart-reads#13"
  },
  "/nope": {
    "method": "GET",
    "status": 404,
    "body": {
      "error": "Not Found"
    },
    "fixtureId": "quickstart-reads#13"
  },
  "quickstart:/posts/3": {
    "method": "GET",
    "status": 404,
    "body": {
      "error": "Not Found"
    },
    "fixtureId": "quickstart-write#4"
  },
  "/posts/3": {
    "method": "GET",
    "status": 404,
    "body": {
      "error": "Not Found"
    },
    "fixtureId": "quickstart-write#4"
  },
  "quickstart:/posts/2": {
    "method": "PUT",
    "status": 200,
    "body": {
      "title": "Replaced",
      "views": 1,
      "authorId": "1",
      "id": "2"
    },
    "fixtureId": "quickstart-write#5"
  },
  "/posts/2": {
    "method": "PUT",
    "status": 200,
    "body": {
      "title": "Replaced",
      "views": 1,
      "authorId": "1",
      "id": "2"
    },
    "fixtureId": "quickstart-write#5"
  },
  "tasks:/tasks": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "1",
        "title": "Draft homepage copy",
        "status": "done",
        "priority": 2,
        "projectId": null
      },
      {
        "id": "2",
        "title": "Design navigation",
        "status": "done",
        "priority": 3,
        "projectId": null
      },
      {
        "id": "3",
        "title": "Set up CI",
        "status": "open",
        "priority": 3,
        "projectId": "2"
      },
      {
        "title": "Replaced",
        "status": "open",
        "priority": 1,
        "projectId": "2",
        "id": "4"
      },
      {
        "title": "Review pull request",
        "status": "open",
        "priority": 2,
        "projectId": null,
        "id": "<generated>"
      },
      {
        "id": "<generated>",
        "title": "Own id",
        "status": "open",
        "priority": 1,
        "projectId": null
      }
    ],
    "fixtureId": "tasks-write#7"
  },
  "/tasks": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "1",
        "title": "Draft homepage copy",
        "status": "done",
        "priority": 2,
        "projectId": null
      },
      {
        "id": "2",
        "title": "Design navigation",
        "status": "done",
        "priority": 3,
        "projectId": null
      },
      {
        "id": "3",
        "title": "Set up CI",
        "status": "open",
        "priority": 3,
        "projectId": "2"
      },
      {
        "title": "Replaced",
        "status": "open",
        "priority": 1,
        "projectId": "2",
        "id": "4"
      },
      {
        "title": "Review pull request",
        "status": "open",
        "priority": 2,
        "projectId": null,
        "id": "<generated>"
      },
      {
        "id": "<generated>",
        "title": "Own id",
        "status": "open",
        "priority": 1,
        "projectId": null
      }
    ],
    "fixtureId": "tasks-write#7"
  },
  "tasks:/tasks/3": {
    "method": "GET",
    "status": 200,
    "body": {
      "id": "3",
      "title": "Set up CI",
      "status": "open",
      "priority": 3,
      "projectId": "2"
    },
    "fixtureId": "tasks-filter-sort#1"
  },
  "/tasks/3": {
    "method": "GET",
    "status": 200,
    "body": {
      "id": "3",
      "title": "Set up CI",
      "status": "open",
      "priority": 3,
      "projectId": "2"
    },
    "fixtureId": "tasks-filter-sort#1"
  },
  "tasks:/tasks/999": {
    "method": "GET",
    "status": 404,
    "body": {
      "error": "Not Found"
    },
    "fixtureId": "tasks-filter-sort#2"
  },
  "/tasks/999": {
    "method": "GET",
    "status": 404,
    "body": {
      "error": "Not Found"
    },
    "fixtureId": "tasks-filter-sort#2"
  },
  "tasks:/projects": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "2",
        "name": "Mobile app"
      }
    ],
    "fixtureId": "tasks-write#8"
  },
  "/projects": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "2",
        "name": "Mobile app"
      }
    ],
    "fixtureId": "tasks-write#8"
  },
  "tasks:/projects/1": {
    "method": "GET",
    "status": 200,
    "body": {
      "id": "1",
      "name": "Website relaunch"
    },
    "fixtureId": "tasks-filter-sort#4"
  },
  "/projects/1": {
    "method": "GET",
    "status": 200,
    "body": {
      "id": "1",
      "name": "Website relaunch"
    },
    "fixtureId": "tasks-filter-sort#4"
  },
  "tasks:/tasks?status=open": {
    "method": "GET",
    "status": 200,
    "body": [
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
    ],
    "fixtureId": "tasks-filter-sort#5"
  },
  "/tasks?status=open": {
    "method": "GET",
    "status": 200,
    "body": [
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
    ],
    "fixtureId": "tasks-filter-sort#5"
  },
  "tasks:/tasks?status=open&priority:gte=2": {
    "method": "GET",
    "status": 200,
    "body": [
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
    ],
    "fixtureId": "tasks-filter-sort#6"
  },
  "/tasks?status=open&priority:gte=2": {
    "method": "GET",
    "status": 200,
    "body": [
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
    ],
    "fixtureId": "tasks-filter-sort#6"
  },
  "tasks:/tasks?status:ne=done": {
    "method": "GET",
    "status": 200,
    "body": [
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
      },
      {
        "id": "5",
        "title": "Fix login bug",
        "status": "blocked",
        "priority": 3,
        "projectId": "2"
      }
    ],
    "fixtureId": "tasks-filter-sort#7"
  },
  "/tasks?status:ne=done": {
    "method": "GET",
    "status": 200,
    "body": [
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
      },
      {
        "id": "5",
        "title": "Fix login bug",
        "status": "blocked",
        "priority": 3,
        "projectId": "2"
      }
    ],
    "fixtureId": "tasks-filter-sort#7"
  },
  "tasks:/tasks?priority:gt=1": {
    "method": "GET",
    "status": 200,
    "body": [
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
        "id": "5",
        "title": "Fix login bug",
        "status": "blocked",
        "priority": 3,
        "projectId": "2"
      }
    ],
    "fixtureId": "tasks-filter-sort#8"
  },
  "/tasks?priority:gt=1": {
    "method": "GET",
    "status": 200,
    "body": [
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
        "id": "5",
        "title": "Fix login bug",
        "status": "blocked",
        "priority": 3,
        "projectId": "2"
      }
    ],
    "fixtureId": "tasks-filter-sort#8"
  },
  "tasks:/tasks?priority:lt=3": {
    "method": "GET",
    "status": 200,
    "body": [
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
    ],
    "fixtureId": "tasks-filter-sort#9"
  },
  "/tasks?priority:lt=3": {
    "method": "GET",
    "status": 200,
    "body": [
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
    ],
    "fixtureId": "tasks-filter-sort#9"
  },
  "tasks:/tasks?priority:lte=2": {
    "method": "GET",
    "status": 200,
    "body": [
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
    ],
    "fixtureId": "tasks-filter-sort#10"
  },
  "/tasks?priority:lte=2": {
    "method": "GET",
    "status": 200,
    "body": [
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
    ],
    "fixtureId": "tasks-filter-sort#10"
  },
  "tasks:/tasks?priority:eq=3": {
    "method": "GET",
    "status": 200,
    "body": [
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
        "id": "5",
        "title": "Fix login bug",
        "status": "blocked",
        "priority": 3,
        "projectId": "2"
      }
    ],
    "fixtureId": "tasks-filter-sort#11"
  },
  "/tasks?priority:eq=3": {
    "method": "GET",
    "status": 200,
    "body": [
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
        "id": "5",
        "title": "Fix login bug",
        "status": "blocked",
        "priority": 3,
        "projectId": "2"
      }
    ],
    "fixtureId": "tasks-filter-sort#11"
  },
  "tasks:/tasks?status:in=open,blocked": {
    "method": "GET",
    "status": 200,
    "body": [
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
      },
      {
        "id": "5",
        "title": "Fix login bug",
        "status": "blocked",
        "priority": 3,
        "projectId": "2"
      }
    ],
    "fixtureId": "tasks-filter-sort#12"
  },
  "/tasks?status:in=open,blocked": {
    "method": "GET",
    "status": 200,
    "body": [
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
      },
      {
        "id": "5",
        "title": "Fix login bug",
        "status": "blocked",
        "priority": 3,
        "projectId": "2"
      }
    ],
    "fixtureId": "tasks-filter-sort#12"
  },
  "tasks:/tasks?title:contains=release": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "4",
        "title": "Write release notes",
        "status": "open",
        "priority": 1,
        "projectId": "2"
      }
    ],
    "fixtureId": "tasks-filter-sort#13"
  },
  "/tasks?title:contains=release": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "4",
        "title": "Write release notes",
        "status": "open",
        "priority": 1,
        "projectId": "2"
      }
    ],
    "fixtureId": "tasks-filter-sort#13"
  },
  "tasks:/tasks?title:startsWith=Set": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "3",
        "title": "Set up CI",
        "status": "open",
        "priority": 3,
        "projectId": "2"
      }
    ],
    "fixtureId": "tasks-filter-sort#14"
  },
  "/tasks?title:startsWith=Set": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "3",
        "title": "Set up CI",
        "status": "open",
        "priority": 3,
        "projectId": "2"
      }
    ],
    "fixtureId": "tasks-filter-sort#14"
  },
  "tasks:/tasks?status=open&status=blocked": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "5",
        "title": "Fix login bug",
        "status": "blocked",
        "priority": 3,
        "projectId": "2"
      }
    ],
    "fixtureId": "tasks-filter-sort#15"
  },
  "/tasks?status=open&status=blocked": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "5",
        "title": "Fix login bug",
        "status": "blocked",
        "priority": 3,
        "projectId": "2"
      }
    ],
    "fixtureId": "tasks-filter-sort#15"
  },
  "tasks:/tasks?_sort=-priority,title": {
    "method": "GET",
    "status": 200,
    "body": [
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
    ],
    "fixtureId": "tasks-filter-sort#16"
  },
  "/tasks?_sort=-priority,title": {
    "method": "GET",
    "status": 200,
    "body": [
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
    ],
    "fixtureId": "tasks-filter-sort#16"
  },
  "tasks:/tasks?_sort=priority": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "4",
        "title": "Write release notes",
        "status": "open",
        "priority": 1,
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
        "id": "5",
        "title": "Fix login bug",
        "status": "blocked",
        "priority": 3,
        "projectId": "2"
      }
    ],
    "fixtureId": "tasks-filter-sort#17"
  },
  "/tasks?_sort=priority": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "4",
        "title": "Write release notes",
        "status": "open",
        "priority": 1,
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
        "id": "5",
        "title": "Fix login bug",
        "status": "blocked",
        "priority": 3,
        "projectId": "2"
      }
    ],
    "fixtureId": "tasks-filter-sort#17"
  },
  "tasks:/tasks?_sort=-title": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "4",
        "title": "Write release notes",
        "status": "open",
        "priority": 1,
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
        "id": "5",
        "title": "Fix login bug",
        "status": "blocked",
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
        "id": "2",
        "title": "Design navigation",
        "status": "done",
        "priority": 3,
        "projectId": "1"
      }
    ],
    "fixtureId": "tasks-filter-sort#18"
  },
  "/tasks?_sort=-title": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "4",
        "title": "Write release notes",
        "status": "open",
        "priority": 1,
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
        "id": "5",
        "title": "Fix login bug",
        "status": "blocked",
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
        "id": "2",
        "title": "Design navigation",
        "status": "done",
        "priority": 3,
        "projectId": "1"
      }
    ],
    "fixtureId": "tasks-filter-sort#18"
  },
  "tasks:/tasks?priority=3": {
    "method": "GET",
    "status": 200,
    "body": [
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
        "id": "5",
        "title": "Fix login bug",
        "status": "blocked",
        "priority": 3,
        "projectId": "2"
      }
    ],
    "fixtureId": "tasks-filter-sort#19"
  },
  "/tasks?priority=3": {
    "method": "GET",
    "status": 200,
    "body": [
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
        "id": "5",
        "title": "Fix login bug",
        "status": "blocked",
        "priority": 3,
        "projectId": "2"
      }
    ],
    "fixtureId": "tasks-filter-sort#19"
  },
  "tasks:/tasks?projectId=2": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "title": "Number FK",
        "status": "open",
        "priority": 1,
        "projectId": 2,
        "id": "<generated>"
      }
    ],
    "fixtureId": "tasks-write#10"
  },
  "/tasks?projectId=2": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "title": "Number FK",
        "status": "open",
        "priority": 1,
        "projectId": 2,
        "id": "<generated>"
      }
    ],
    "fixtureId": "tasks-write#10"
  },
  "tasks:/tasks?projectId=1": {
    "method": "GET",
    "status": 200,
    "body": [],
    "fixtureId": "tasks-filter-sort#21"
  },
  "/tasks?projectId=1": {
    "method": "GET",
    "status": 200,
    "body": [],
    "fixtureId": "tasks-filter-sort#21"
  },
  "tasks:/tasks?projectId:ne=1": {
    "method": "GET",
    "status": 200,
    "body": [
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
    ],
    "fixtureId": "tasks-filter-sort#22"
  },
  "/tasks?projectId:ne=1": {
    "method": "GET",
    "status": 200,
    "body": [
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
    ],
    "fixtureId": "tasks-filter-sort#22"
  },
  "tasks:/tasks?projectId:gte=2": {
    "method": "GET",
    "status": 200,
    "body": [
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
    ],
    "fixtureId": "tasks-filter-sort#23"
  },
  "/tasks?projectId:gte=2": {
    "method": "GET",
    "status": 200,
    "body": [
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
    ],
    "fixtureId": "tasks-filter-sort#23"
  },
  "tasks:/tasks?projectid=2": {
    "method": "GET",
    "status": 200,
    "body": [],
    "fixtureId": "tasks-filter-sort#24"
  },
  "/tasks?projectid=2": {
    "method": "GET",
    "status": 200,
    "body": [],
    "fixtureId": "tasks-filter-sort#24"
  },
  "tasks:/tasks?projectId:contains=2": {
    "method": "GET",
    "status": 200,
    "body": [
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
    ],
    "fixtureId": "tasks-filter-sort#25"
  },
  "/tasks?projectId:contains=2": {
    "method": "GET",
    "status": 200,
    "body": [
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
    ],
    "fixtureId": "tasks-filter-sort#25"
  },
  "tasks:/tasks?projectId:startsWith=2": {
    "method": "GET",
    "status": 200,
    "body": [
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
    ],
    "fixtureId": "tasks-filter-sort#26"
  },
  "/tasks?projectId:startsWith=2": {
    "method": "GET",
    "status": 200,
    "body": [
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
    ],
    "fixtureId": "tasks-filter-sort#26"
  },
  "tasks:/tasks?projectId:endsWith=2": {
    "method": "GET",
    "status": 200,
    "body": [
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
    ],
    "fixtureId": "tasks-filter-sort#27"
  },
  "/tasks?projectId:endsWith=2": {
    "method": "GET",
    "status": 200,
    "body": [
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
    ],
    "fixtureId": "tasks-filter-sort#27"
  },
  "tasks:/tasks?projectId:in=2": {
    "method": "GET",
    "status": 200,
    "body": [],
    "fixtureId": "tasks-filter-sort#28"
  },
  "/tasks?projectId:in=2": {
    "method": "GET",
    "status": 200,
    "body": [],
    "fixtureId": "tasks-filter-sort#28"
  },
  "tasks:/tasks?projectId:eq=2": {
    "method": "GET",
    "status": 200,
    "body": [],
    "fixtureId": "tasks-filter-sort#29"
  },
  "/tasks?projectId:eq=2": {
    "method": "GET",
    "status": 200,
    "body": [],
    "fixtureId": "tasks-filter-sort#29"
  },
  "tasks:/tasks?status=OPEN": {
    "method": "GET",
    "status": 200,
    "body": [],
    "fixtureId": "tasks-filter-sort#30"
  },
  "/tasks?status=OPEN": {
    "method": "GET",
    "status": 200,
    "body": [],
    "fixtureId": "tasks-filter-sort#30"
  },
  "tasks:/tasks?title:contains=Release": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "4",
        "title": "Write release notes",
        "status": "open",
        "priority": 1,
        "projectId": "2"
      }
    ],
    "fixtureId": "tasks-filter-sort#31"
  },
  "/tasks?title:contains=Release": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "4",
        "title": "Write release notes",
        "status": "open",
        "priority": 1,
        "projectId": "2"
      }
    ],
    "fixtureId": "tasks-filter-sort#31"
  },
  "tasks:/tasks?priority:gte=2&priority:lte=2": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "1",
        "title": "Draft homepage copy",
        "status": "open",
        "priority": 2,
        "projectId": "1"
      }
    ],
    "fixtureId": "tasks-filter-sort#32"
  },
  "/tasks?priority:gte=2&priority:lte=2": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "1",
        "title": "Draft homepage copy",
        "status": "open",
        "priority": 2,
        "projectId": "1"
      }
    ],
    "fixtureId": "tasks-filter-sort#32"
  },
  "tasks:/tasks?_sort=status,-priority": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "5",
        "title": "Fix login bug",
        "status": "blocked",
        "priority": 3,
        "projectId": "2"
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
    ],
    "fixtureId": "tasks-filter-sort#33"
  },
  "/tasks?_sort=status,-priority": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "5",
        "title": "Fix login bug",
        "status": "blocked",
        "priority": 3,
        "projectId": "2"
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
    ],
    "fixtureId": "tasks-filter-sort#33"
  },
  "tasks:/tasks?_sort=-id": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "5",
        "title": "Fix login bug",
        "status": "blocked",
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
        "id": "3",
        "title": "Set up CI",
        "status": "open",
        "priority": 3,
        "projectId": "2"
      },
      {
        "id": "2",
        "title": "Design navigation",
        "status": "done",
        "priority": 3,
        "projectId": "1"
      },
      {
        "id": "1",
        "title": "Draft homepage copy",
        "status": "open",
        "priority": 2,
        "projectId": "1"
      }
    ],
    "fixtureId": "tasks-filter-sort#34"
  },
  "/tasks?_sort=-id": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "5",
        "title": "Fix login bug",
        "status": "blocked",
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
        "id": "3",
        "title": "Set up CI",
        "status": "open",
        "priority": 3,
        "projectId": "2"
      },
      {
        "id": "2",
        "title": "Design navigation",
        "status": "done",
        "priority": 3,
        "projectId": "1"
      },
      {
        "id": "1",
        "title": "Draft homepage copy",
        "status": "open",
        "priority": 2,
        "projectId": "1"
      }
    ],
    "fixtureId": "tasks-filter-sort#34"
  },
  "tasks:/tasks?_page=1&_per_page=2": {
    "method": "GET",
    "status": 200,
    "body": {
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
    },
    "fixtureId": "tasks-paginate-embed#0"
  },
  "/tasks?_page=1&_per_page=2": {
    "method": "GET",
    "status": 200,
    "body": {
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
    },
    "fixtureId": "tasks-paginate-embed#0"
  },
  "tasks:/tasks?_page=2&_per_page=2": {
    "method": "GET",
    "status": 200,
    "body": {
      "first": 1,
      "prev": 1,
      "next": 3,
      "last": 3,
      "pages": 3,
      "items": 5,
      "data": [
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
    "fixtureId": "tasks-paginate-embed#1"
  },
  "/tasks?_page=2&_per_page=2": {
    "method": "GET",
    "status": 200,
    "body": {
      "first": 1,
      "prev": 1,
      "next": 3,
      "last": 3,
      "pages": 3,
      "items": 5,
      "data": [
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
    "fixtureId": "tasks-paginate-embed#1"
  },
  "tasks:/tasks?_page=3&_per_page=2": {
    "method": "GET",
    "status": 200,
    "body": {
      "first": 1,
      "prev": 2,
      "next": null,
      "last": 3,
      "pages": 3,
      "items": 5,
      "data": [
        {
          "id": "5",
          "title": "Fix login bug",
          "status": "blocked",
          "priority": 3,
          "projectId": "2"
        }
      ]
    },
    "fixtureId": "tasks-paginate-embed#2"
  },
  "/tasks?_page=3&_per_page=2": {
    "method": "GET",
    "status": 200,
    "body": {
      "first": 1,
      "prev": 2,
      "next": null,
      "last": 3,
      "pages": 3,
      "items": 5,
      "data": [
        {
          "id": "5",
          "title": "Fix login bug",
          "status": "blocked",
          "priority": 3,
          "projectId": "2"
        }
      ]
    },
    "fixtureId": "tasks-paginate-embed#2"
  },
  "tasks:/tasks?_page=9&_per_page=2": {
    "method": "GET",
    "status": 200,
    "body": {
      "first": 1,
      "prev": 2,
      "next": null,
      "last": 3,
      "pages": 3,
      "items": 5,
      "data": [
        {
          "id": "5",
          "title": "Fix login bug",
          "status": "blocked",
          "priority": 3,
          "projectId": "2"
        }
      ]
    },
    "fixtureId": "tasks-paginate-embed#3"
  },
  "/tasks?_page=9&_per_page=2": {
    "method": "GET",
    "status": 200,
    "body": {
      "first": 1,
      "prev": 2,
      "next": null,
      "last": 3,
      "pages": 3,
      "items": 5,
      "data": [
        {
          "id": "5",
          "title": "Fix login bug",
          "status": "blocked",
          "priority": 3,
          "projectId": "2"
        }
      ]
    },
    "fixtureId": "tasks-paginate-embed#3"
  },
  "tasks:/tasks?_per_page=1": {
    "method": "GET",
    "status": 200,
    "body": [
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
    ],
    "fixtureId": "tasks-paginate-embed#4"
  },
  "/tasks?_per_page=1": {
    "method": "GET",
    "status": 200,
    "body": [
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
    ],
    "fixtureId": "tasks-paginate-embed#4"
  },
  "tasks:/tasks?_page=1": {
    "method": "GET",
    "status": 200,
    "body": {
      "first": 1,
      "prev": null,
      "next": null,
      "last": 1,
      "pages": 1,
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
    },
    "fixtureId": "tasks-paginate-embed#5"
  },
  "/tasks?_page=1": {
    "method": "GET",
    "status": 200,
    "body": {
      "first": 1,
      "prev": null,
      "next": null,
      "last": 1,
      "pages": 1,
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
    },
    "fixtureId": "tasks-paginate-embed#5"
  },
  "tasks:/tasks?status=open&_page=1&_per_page=2": {
    "method": "GET",
    "status": 200,
    "body": {
      "first": 1,
      "prev": null,
      "next": 2,
      "last": 2,
      "pages": 2,
      "items": 3,
      "data": [
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
    "fixtureId": "tasks-paginate-embed#6"
  },
  "/tasks?status=open&_page=1&_per_page=2": {
    "method": "GET",
    "status": 200,
    "body": {
      "first": 1,
      "prev": null,
      "next": 2,
      "last": 2,
      "pages": 2,
      "items": 3,
      "data": [
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
    "fixtureId": "tasks-paginate-embed#6"
  },
  "tasks:/tasks?status=open&_sort=-priority&_page=1&_per_page=2": {
    "method": "GET",
    "status": 200,
    "body": {
      "first": 1,
      "prev": null,
      "next": 2,
      "last": 2,
      "pages": 2,
      "items": 3,
      "data": [
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
        }
      ]
    },
    "fixtureId": "tasks-paginate-embed#7"
  },
  "/tasks?status=open&_sort=-priority&_page=1&_per_page=2": {
    "method": "GET",
    "status": 200,
    "body": {
      "first": 1,
      "prev": null,
      "next": 2,
      "last": 2,
      "pages": 2,
      "items": 3,
      "data": [
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
        }
      ]
    },
    "fixtureId": "tasks-paginate-embed#7"
  },
  "tasks:/tasks?_sort=-priority&_page=1&_per_page=2": {
    "method": "GET",
    "status": 200,
    "body": {
      "first": 1,
      "prev": null,
      "next": 2,
      "last": 3,
      "pages": 3,
      "items": 5,
      "data": [
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
        }
      ]
    },
    "fixtureId": "tasks-paginate-embed#8"
  },
  "/tasks?_sort=-priority&_page=1&_per_page=2": {
    "method": "GET",
    "status": 200,
    "body": {
      "first": 1,
      "prev": null,
      "next": 2,
      "last": 3,
      "pages": 3,
      "items": 5,
      "data": [
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
        }
      ]
    },
    "fixtureId": "tasks-paginate-embed#8"
  },
  "tasks:/tasks?_limit=1": {
    "method": "GET",
    "status": 200,
    "body": [],
    "fixtureId": "tasks-paginate-embed#9"
  },
  "/tasks?_limit=1": {
    "method": "GET",
    "status": 200,
    "body": [],
    "fixtureId": "tasks-paginate-embed#9"
  },
  "tasks:/tasks?_start=0&_end=1": {
    "method": "GET",
    "status": 200,
    "body": [],
    "fixtureId": "tasks-paginate-embed#10"
  },
  "/tasks?_start=0&_end=1": {
    "method": "GET",
    "status": 200,
    "body": [],
    "fixtureId": "tasks-paginate-embed#10"
  },
  "tasks:/tasks?_start=1&_limit=2": {
    "method": "GET",
    "status": 200,
    "body": [],
    "fixtureId": "tasks-paginate-embed#11"
  },
  "/tasks?_start=1&_limit=2": {
    "method": "GET",
    "status": 200,
    "body": [],
    "fixtureId": "tasks-paginate-embed#11"
  },
  "tasks:/tasks?_page=0&_per_page=2": {
    "method": "GET",
    "status": 200,
    "body": {
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
    },
    "fixtureId": "tasks-paginate-embed#12"
  },
  "/tasks?_page=0&_per_page=2": {
    "method": "GET",
    "status": 200,
    "body": {
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
    },
    "fixtureId": "tasks-paginate-embed#12"
  },
  "tasks:/tasks?_page=1&_per_page=0": {
    "method": "GET",
    "status": 200,
    "body": {
      "first": 1,
      "prev": null,
      "next": 2,
      "last": 5,
      "pages": 5,
      "items": 5,
      "data": [
        {
          "id": "1",
          "title": "Draft homepage copy",
          "status": "open",
          "priority": 2,
          "projectId": "1"
        }
      ]
    },
    "fixtureId": "tasks-paginate-embed#13"
  },
  "/tasks?_page=1&_per_page=0": {
    "method": "GET",
    "status": 200,
    "body": {
      "first": 1,
      "prev": null,
      "next": 2,
      "last": 5,
      "pages": 5,
      "items": 5,
      "data": [
        {
          "id": "1",
          "title": "Draft homepage copy",
          "status": "open",
          "priority": 2,
          "projectId": "1"
        }
      ]
    },
    "fixtureId": "tasks-paginate-embed#13"
  },
  "tasks:/tasks?_page=abc": {
    "method": "GET",
    "status": 200,
    "body": [
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
    ],
    "fixtureId": "tasks-paginate-embed#14"
  },
  "/tasks?_page=abc": {
    "method": "GET",
    "status": 200,
    "body": [
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
    ],
    "fixtureId": "tasks-paginate-embed#14"
  },
  "tasks:/tasks/3?_embed=project": {
    "method": "GET",
    "status": 200,
    "body": {
      "id": "3",
      "title": "Set up CI",
      "status": "open",
      "priority": 3,
      "projectId": "2",
      "project": {
        "id": "2",
        "name": "Mobile app"
      }
    },
    "fixtureId": "tasks-paginate-embed#15"
  },
  "/tasks/3?_embed=project": {
    "method": "GET",
    "status": 200,
    "body": {
      "id": "3",
      "title": "Set up CI",
      "status": "open",
      "priority": 3,
      "projectId": "2",
      "project": {
        "id": "2",
        "name": "Mobile app"
      }
    },
    "fixtureId": "tasks-paginate-embed#15"
  },
  "tasks:/projects/2?_embed=tasks": {
    "method": "GET",
    "status": 200,
    "body": {
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
    },
    "fixtureId": "tasks-paginate-embed#16"
  },
  "/projects/2?_embed=tasks": {
    "method": "GET",
    "status": 200,
    "body": {
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
    },
    "fixtureId": "tasks-paginate-embed#16"
  },
  "tasks:/projects/1?_embed=tasks": {
    "method": "GET",
    "status": 200,
    "body": {
      "id": "1",
      "name": "Website relaunch",
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
        }
      ]
    },
    "fixtureId": "tasks-paginate-embed#17"
  },
  "/projects/1?_embed=tasks": {
    "method": "GET",
    "status": 200,
    "body": {
      "id": "1",
      "name": "Website relaunch",
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
        }
      ]
    },
    "fixtureId": "tasks-paginate-embed#17"
  },
  "tasks:/tasks?_embed=project": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "1",
        "title": "Draft homepage copy",
        "status": "open",
        "priority": 2,
        "projectId": "1",
        "project": {
          "id": "1",
          "name": "Website relaunch"
        }
      },
      {
        "id": "2",
        "title": "Design navigation",
        "status": "done",
        "priority": 3,
        "projectId": "1",
        "project": {
          "id": "1",
          "name": "Website relaunch"
        }
      },
      {
        "id": "3",
        "title": "Set up CI",
        "status": "open",
        "priority": 3,
        "projectId": "2",
        "project": {
          "id": "2",
          "name": "Mobile app"
        }
      },
      {
        "id": "4",
        "title": "Write release notes",
        "status": "open",
        "priority": 1,
        "projectId": "2",
        "project": {
          "id": "2",
          "name": "Mobile app"
        }
      },
      {
        "id": "5",
        "title": "Fix login bug",
        "status": "blocked",
        "priority": 3,
        "projectId": "2",
        "project": {
          "id": "2",
          "name": "Mobile app"
        }
      }
    ],
    "fixtureId": "tasks-paginate-embed#18"
  },
  "/tasks?_embed=project": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "1",
        "title": "Draft homepage copy",
        "status": "open",
        "priority": 2,
        "projectId": "1",
        "project": {
          "id": "1",
          "name": "Website relaunch"
        }
      },
      {
        "id": "2",
        "title": "Design navigation",
        "status": "done",
        "priority": 3,
        "projectId": "1",
        "project": {
          "id": "1",
          "name": "Website relaunch"
        }
      },
      {
        "id": "3",
        "title": "Set up CI",
        "status": "open",
        "priority": 3,
        "projectId": "2",
        "project": {
          "id": "2",
          "name": "Mobile app"
        }
      },
      {
        "id": "4",
        "title": "Write release notes",
        "status": "open",
        "priority": 1,
        "projectId": "2",
        "project": {
          "id": "2",
          "name": "Mobile app"
        }
      },
      {
        "id": "5",
        "title": "Fix login bug",
        "status": "blocked",
        "priority": 3,
        "projectId": "2",
        "project": {
          "id": "2",
          "name": "Mobile app"
        }
      }
    ],
    "fixtureId": "tasks-paginate-embed#18"
  },
  "tasks:/projects?_embed=tasks": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "1",
        "name": "Website relaunch",
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
          }
        ]
      },
      {
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
    ],
    "fixtureId": "tasks-paginate-embed#19"
  },
  "/projects?_embed=tasks": {
    "method": "GET",
    "status": 200,
    "body": [
      {
        "id": "1",
        "name": "Website relaunch",
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
          }
        ]
      },
      {
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
    ],
    "fixtureId": "tasks-paginate-embed#19"
  },
  "tasks:/tasks/3?_embed=nothing": {
    "method": "GET",
    "status": 200,
    "body": {
      "id": "3",
      "title": "Set up CI",
      "status": "open",
      "priority": 3,
      "projectId": "2"
    },
    "fixtureId": "tasks-paginate-embed#20"
  },
  "/tasks/3?_embed=nothing": {
    "method": "GET",
    "status": 200,
    "body": {
      "id": "3",
      "title": "Set up CI",
      "status": "open",
      "priority": 3,
      "projectId": "2"
    },
    "fixtureId": "tasks-paginate-embed#20"
  },
  "tasks:/tasks/custom-id": {
    "method": "GET",
    "status": 404,
    "body": {
      "error": "Not Found"
    },
    "fixtureId": "tasks-write#2"
  },
  "/tasks/custom-id": {
    "method": "GET",
    "status": 404,
    "body": {
      "error": "Not Found"
    },
    "fixtureId": "tasks-write#2"
  },
  "tasks:/tasks/1": {
    "method": "PATCH",
    "status": 200,
    "body": {
      "id": "1",
      "title": "Draft homepage copy",
      "status": "done",
      "priority": 2,
      "projectId": "1"
    },
    "fixtureId": "tasks-write#3"
  },
  "/tasks/1": {
    "method": "PATCH",
    "status": 200,
    "body": {
      "id": "1",
      "title": "Draft homepage copy",
      "status": "done",
      "priority": 2,
      "projectId": "1"
    },
    "fixtureId": "tasks-write#3"
  },
  "tasks:/tasks/4": {
    "method": "PUT",
    "status": 200,
    "body": {
      "title": "Replaced",
      "status": "open",
      "priority": 1,
      "projectId": "2",
      "id": "4"
    },
    "fixtureId": "tasks-write#4"
  },
  "/tasks/4": {
    "method": "PUT",
    "status": 200,
    "body": {
      "title": "Replaced",
      "status": "open",
      "priority": 1,
      "projectId": "2",
      "id": "4"
    },
    "fixtureId": "tasks-write#4"
  },
  "tasks:/tasks/5": {
    "method": "DELETE",
    "status": 200,
    "body": {
      "id": "5",
      "title": "Fix login bug",
      "status": "blocked",
      "priority": 3,
      "projectId": "2"
    },
    "fixtureId": "tasks-write#5"
  },
  "/tasks/5": {
    "method": "DELETE",
    "status": 200,
    "body": {
      "id": "5",
      "title": "Fix login bug",
      "status": "blocked",
      "priority": 3,
      "projectId": "2"
    },
    "fixtureId": "tasks-write#5"
  }
};
