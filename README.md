## YuzuNet

- YuzuNet is a social media platform that focuses on creating communities around all kinds of things. Users can post, like, comment, share photos, and video. They can also create open and closed groups to build their own communities. The platform has integration with movie and book APIs for users to review and share posts about their favourite stories, authors, directors, actors, and more.
Architecture

- The platform is built using several technologies:

* Frontend: TypeScript and React
* Post service: Go
* User service: Node.js + TypeScript
* Data storage: Cassandra, Redis, PostgreSQL
* Search: Elasticsearch

## Frontend

- The frontend is built using TypeScript and React. It allows users to sign up, log in, and interact with the platform by creating posts, commenting, liking, sharing, and searching for other users and posts. The interface is responsive and user-friendly.

## Post Service

- The post service is written in Go. It is responsible for handling all post-related operations, including creating, updating, and deleting posts, as well as handling likes, comments, and sharing. It interacts with the Cassandra database to store and retrieve post data, and uses Redis as a cache to speed up post ranking and data retrieval.

## Data Storage

- The platform uses Cassandra as its primary database to store post data, including post content, likes, and comments. Cassandra provides high availability, scalability, and fault tolerance, which are important features for a social media platform. Redis is used as a cache to speed up post ranking and data retrieval.
Search

- The platform uses Elasticsearch to provide fuzzy search capabilities for posts and users. Elasticsearch provides fast and efficient search operations, even with large amounts of data.
Deployment

- The platform is deployed using Docker containers, making it easy to deploy and scale. The following Docker containers are used:

* Frontend container: runs the frontend application
* Post service container: runs the Go post service
* Cassandra container: runs the Cassandra database
* Redis container: runs the Redis cache
* Elasticsearch container: runs the Elasticsearch search engine

## Conclusion

YuzuNet is a social media platform that provides a wide range of features for users to connect and share their interests. The platform is built using modern technologies and can be easily deployed and scaled.