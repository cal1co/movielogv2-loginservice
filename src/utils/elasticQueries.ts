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

    formatParams(value: string) {
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

    async userSearch(value: string) {
        const searchParams = elastic.formatParams(value)

        const res = await client.search<SearchHit>(searchParams)
        .catch((error) => {
            return error
        });
        return res.hits.hits.map((hit: { _source: any; }) => hit._source);

    }


}


export default elastic