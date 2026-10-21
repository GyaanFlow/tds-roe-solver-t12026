// Dated copy of https://stats.aipipe.org/usage.json (the public AI Pipe usage feed the P1 prediction question uses).
// The live feed allows browser requests, so the tool loads it directly; this dated copy is only the offline fallback
// (the tool also accepts a pasted copy). Refresh with: node scripts/refresh-aipipe-snapshot.mjs
export const snapshotFetchedAt = '2026-10-21T10:42:15Z';
export const snapshot = {
  "schema_version": 1,
  "timezone": "UTC",
  "collection_started_on": "2026-10-15",
  "days": [
    {
      "date": "2026-10-15",
      "complete": true,
      "available": true,
      "total": {
        "spend_usd": 0.7682201999999996,
        "input_tokens": 290779,
        "output_tokens": 555527
      },
      "providers": {
        "openai": {
          "spend_usd": 0.7682201999999996,
          "input_tokens": 290779,
          "output_tokens": 555527
        }
      },
      "iitm_users": 117,
      "users_by_provider_count": {
        "1": 124,
        "2": 0,
        "3+": 0
      }
    },
    {
      "date": "2026-10-16",
      "complete": true,
      "available": true,
      "total": {
        "spend_usd": 0.8238163600000002,
        "input_tokens": 1017301,
        "output_tokens": 568321
      },
      "providers": {
        "gemini": {
          "spend_usd": 0.007903100000000001,
          "input_tokens": 33319,
          "output_tokens": 11428
        },
        "openai": {
          "spend_usd": 0.8159132600000002,
          "input_tokens": 983982,
          "output_tokens": 556893
        }
      },
      "iitm_users": 142,
      "users_by_provider_count": {
        "1": 149,
        "2": 1,
        "3+": 0
      }
    },
    {
      "date": "2026-10-17",
      "complete": true,
      "available": true,
      "total": {
        "spend_usd": 1.8324309000000008,
        "input_tokens": 1457893,
        "output_tokens": 1137888
      },
      "providers": {
        "gemini": {
          "spend_usd": 0.0000046,
          "input_tokens": 7,
          "output_tokens": 1
        },
        "openai": {
          "spend_usd": 1.8324263000000007,
          "input_tokens": 1457886,
          "output_tokens": 1137887
        }
      },
      "iitm_users": 219,
      "users_by_provider_count": {
        "1": 236,
        "2": 1,
        "3+": 0
      }
    },
    {
      "date": "2026-10-18",
      "complete": true,
      "available": true,
      "total": {
        "spend_usd": 2.9453845,
        "input_tokens": 2680655,
        "output_tokens": 1492653
      },
      "providers": {
        "openai": {
          "spend_usd": 2.9453845,
          "input_tokens": 2680655,
          "output_tokens": 1492653
        }
      },
      "iitm_users": 489,
      "users_by_provider_count": {
        "1": 536,
        "2": 0,
        "3+": 0
      }
    },
    {
      "date": "2026-10-19",
      "complete": true,
      "available": true,
      "total": {
        "spend_usd": 0.22610058999999996,
        "input_tokens": 666504,
        "output_tokens": 460891
      },
      "providers": {
        "openai": {
          "spend_usd": 0.22610058999999996,
          "input_tokens": 666504,
          "output_tokens": 460891
        }
      },
      "iitm_users": 2,
      "users_by_provider_count": {
        "1": 3,
        "2": 0,
        "3+": 0
      }
    },
    {
      "date": "2026-10-20",
      "complete": true,
      "available": true,
      "total": {
        "spend_usd": 1.3671357999999998,
        "input_tokens": 1761937,
        "output_tokens": 125403
      },
      "providers": {
        "openai": {
          "spend_usd": 1.3671357999999998,
          "input_tokens": 1761937,
          "output_tokens": 125403
        }
      },
      "iitm_users": 3,
      "users_by_provider_count": {
        "1": 4,
        "2": 0,
        "3+": 0
      }
    },
    {
      "date": "2026-10-21",
      "complete": false,
      "available": true,
      "total": {
        "spend_usd": 0.08729710000000004,
        "input_tokens": 230783,
        "output_tokens": 66129
      },
      "providers": {
        "gemini": {
          "spend_usd": 0.0000615,
          "input_tokens": 519,
          "output_tokens": 24
        },
        "openai": {
          "spend_usd": 0.08723560000000004,
          "input_tokens": 230264,
          "output_tokens": 66105
        }
      },
      "iitm_users": 1,
      "users_by_provider_count": {
        "1": 1,
        "2": 1,
        "3+": 0
      }
    }
  ],
  "scheduled_for": "2026-10-21T06:00:06.675Z",
  "published_at": "2026-10-21T06:00:08.656Z"
};
