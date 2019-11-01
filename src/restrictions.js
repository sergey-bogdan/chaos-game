// Restrictions return true if current vertex passes the restriction
const restrictions = [
    {
        do: (vertex, vertexes) => vertex.id === vertexes[vertexes.length - 1].id ? false : true,
        description: 'Current vertex cannot be same as previous one'
    },
    {
        do: (vertex, vertexes) => {
            let prev = vertexes[vertexes.length - 1];
            if (!prev) return true;

            if (prev.isLast() && vertex.isFirst()) {
                return false;
            }
            if (prev.id + 1 === vertex.id) {
                return false;
            }

            return true;
        },
        description: 'Current vertex cannot be one place away from previous one (anti-clock wise)',
    },
    {
        do: (vertex, vertexes) => {
            let prev = vertexes[vertexes.length - 1];
            if (!prev) return true;

            // return prev.isNeighbour(vertex) ? true : false;

            if (vertex.id === 1 && prev.id === vertex.totalPoints) {
                return true;
            }

            if (vertex.id === vertex.totalPoints && prev.id === 1) {
                return true;
            }

            if (Math.abs(vertex.id - prev.id) > 1) {
                return false;
            }

            return true;
        },
        description: 'Current vertex cannot be 2 places away from previous one (Only neighbours are allowed)',
    },
    {
        do: (vertex, vertexes) => {
            let prev = vertexes[vertexes.length - 1];
            let pprev = vertexes[vertexes.length - 2];

            if (prev && pprev) {
                if (prev.id === pprev.id) {

                    return vertex.isNeighbour(prev) ? false : true;
                }
            }

            return true;
        },
        description: 'A point inside a square repeatedly jumps half of the distance towards a randomly chosen vertex, but the currently chosen vertex cannot neighbor the previously chosen vertex if the two previously chosen vertices are the same.'
    }
];

export default restrictions;