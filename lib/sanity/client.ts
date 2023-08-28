import {
  postquery,
  limitquery,
  paginatedquery,
  configQuery,
  singlequery,
  pathquery,
  allauthorsquery,
  authorsquery,
  postsbyauthorquery,
  postsbycatquery,
  catpathquery,
  catquery,
  getAll,
  searchquery
} from "./groq";
import { createClient, type ClientConfig } from "next-sanity";

const config: ClientConfig = {
  token: process.env.NEXT_PUBLIC_TOKEN_KEY,
  projectId:
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    (process.env.SANITY_STUDIO_PROJECT_ID as string),
  dataset:
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    ("production" as string),
  useCdn: process.env.NODE_ENV === "production",
  apiVersion:
    process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-03-25"
};
interface Comment {
  _id: string;
  _type: string;
  _createdAt: string;
  approved: boolean;
  comment: string;
  email: string;
  firstParentId: string | null;
  name: string;
  parentCommentId: string | null;
  post: {
    _ref: string;
    _type: string;
  };
  _rev: string;
  _updatedAt: string;
}
export const client = config ? createClient(config) : null;

export const fetcher = async ([query, params]: [string, any]) => {
  if (client) {
    try {
      const data = await client.fetch(query, params);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }
  return null;
};

(async () => {
  if (client) {
    try {
      const data = await client.fetch(getAll);
      if (!data || !data.length) {
        console.error(
          "Sanity returns empty array. Are you sure the dataset is public?"
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
})();

export async function getAllPosts() {
  if (client) {
    return (await client.fetch(postquery)) || [];
  }
  return [];
}

export async function getSettings() {
  if (client) {
    return (await client.fetch(configQuery)) || [];
  }
  return [];
}

export async function getPostBySlug(slug) {
  if (client) {
    return (await client.fetch(singlequery, { slug })) || {};
  }
  return {};
}

export async function getAllPostsSlugs() {
  if (client) {
    const slugs = (await client.fetch(pathquery)) || [];
    return slugs.map(slug => ({ slug }));
  }
  return [];
}
// Author
export async function getAllAuthorsSlugs() {
  if (client) {
    const slugs = (await client.fetch(authorsquery)) || [];
    return slugs.map(slug => ({ author: slug }));
  }
  return [];
}

export async function getAuthorPostsBySlug(slug) {
  if (client) {
    return (await client.fetch(postsbyauthorquery, { slug })) || {};
  }
  return {};
}

export async function getAllAuthors() {
  if (client) {
    return (await client.fetch(allauthorsquery)) || [];
  }
  return [];
}

// Category

export async function getAllCategories() {
  if (client) {
    const slugs = (await client.fetch(catpathquery)) || [];
    return slugs.map(slug => ({ category: slug }));
  }
  return [];
}

export async function getPostsByCategory(slug) {
  if (client) {
    return (await client.fetch(postsbycatquery, { slug })) || {};
  }
  return {};
}

export async function getTopCategories() {
  if (client) {
    return (await client.fetch(catquery)) || [];
  }
  return [];
}

export async function getPaginatedPosts(limit) {
  if (client) {
    return (
      (await client.fetch(paginatedquery, {
        pageIndex: 0,
        limit: limit
      })) || {}
    );
  }
  return {};
}
export async function postCommentByPost(
  comment: Comment
): Promise<Comment | {}> {
  if (client) {
    try {
      return (await client.create(comment)) || {};
    } catch (error) {
      console.error("Error posting comment:", error);
      return {};
    }
  }
  return {};
}
