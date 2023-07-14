import { Client } from '@elastic/elasticsearch';
import { UserInfoResponse } from './userTypes'
import { SearchHit } from './elasticTypes'

const client = new Client({ 
    node: 'https://localhost:9200', 
    auth: {
        username: "elastic",
        password: process.env.ELASTICSEARCH_PASS || "",
      },
      tls: {
        rejectUnauthorized: false,
      },
});

const elastic = {

  formatParams: {
    userSearch(value:string) {
      return {
        index: 'mlv2users',
        body: {
          query: {
            fuzzy: {
              username: {
                value: value,
                      fuzziness: "AUTO"
                    }
                  }
                },
                _source: ["id", "username"]
              },
            }
    },
    postSearch(value:string) {
      return {
        index: 'posts',
        body: {
          query: {
            match: {
              post_content: {
                query: value,
                fuzziness: "AUTO"
              }
            }
          },
          highlight: {
            fields: {
              post_content: {}
            }
          },
          // remove this if you want all information or populate for required info needed
          _source: ["id"]
        }
      }
    }
  },

  async userSearch(value: string) {
      const searchParams = elastic.formatParams.userSearch(value)

      const res = await client.search<SearchHit>(searchParams)
      .catch((error) => {
          return error
      });
      return res.hits.hits.map((hit: { _source: any; }) => hit._source);

  },
  async postSearch(value: string) {
    const searchParams = elastic.formatParams.postSearch(value)
    const res = await client.search(searchParams)
    .catch((error) => {
      return error
    });
    return res.hits.hits.map((hit: { _source: any; }) => hit._source);

  },


}


export default elastic

