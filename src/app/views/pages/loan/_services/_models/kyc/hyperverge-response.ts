export class HypervergeResponse {
    requestId: string;
    result: {
        conf: number;
        match: string;
        'match-score': number;
        match_score: number;
        'to-be-reviewed': string
    };
    status: string;
    statusCode: 200;
}

// Sample Response
// {
//     requestId: "1234567890123-123a12b3-1ab2-1a2b-a123-1ab2c345d6ef";
//     result: {
//         conf: 98,
//         match: "yes",
//         match-score: 98,
//         match_score: 98,
//         to-be-reviewed: "no"
//     }
//     status: "success"
//     statusCode: "200"
// }
