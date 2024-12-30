import Node from "./node.mjs";

export default class Tree {
    constructor(array) {
        this.array = this.prepareArray(array);
        this.root = this.buildTree(this.array);
    }

    #findSuccessorNode(node) {
        let smallest;
        while (node) {
            smallest = node;
            node = node.left;
        }
        return smallest.data;
    }

    prepareArray = (array) => {
        const sortedArr = array.sort((a, b) => a - b);
        // returns with removed duplicates
        return Array.from(new Set(sortedArr));
    };

    buildTree = (array) => {
        if (!array.length) return null;

        const start = 0;
        const end = array.length;
        const mid = Math.floor((start + end) / 2);

        const leftSubArr = array.slice(start, mid);
        const rightSubArr = array.slice(mid + 1, end);

        const root = new Node(array[mid]);

        root.left = this.buildTree(leftSubArr);
        root.right = this.buildTree(rightSubArr);

        return root;
    };

    insert(value, current = this.root) {
        if (value < current.data) {
            if (!current.left) {
                current.left = new Node(value);
                return;
            }
            this.insert(value, (current = current.left));
        } else if (value > current.data) {
            if (!current.right) {
                current.right = new Node(value);
                return;
            }
            this.insert(value, (current = current.right));
        }
    }

    deleteItem(value, current = this.root) {
        if (!current) return "No such node";

        if (value === this.root.data) {
            if (!current.right) {
                this.root = current.left;
                return;
            }
            const successor = this.#findSuccessorNode(current.right);
            this.deleteItem(successor, current);
            current.data = successor;
            return;
        }

        if (current.left && current.left.data === value) {
            if (!current.left.left && !current.left.right) {
                current.left = null;
                return;
            }

            if (current.left.left && current.left.right) {
                // Since we have to search the smallest in right tree, thus we pass right branch of tree in function
                const successor = this.#findSuccessorNode(current.left.right);
                //Deleting of successor can be done recursively
                this.deleteItem(successor, current.left);
                current.left.data = successor;
                return;
            }

            if (current.left.left || current.left.right) {
                current.left = current.left.left || current.left.right;
                return;
            }
        }

        if (current.right && current.right.data === value) {
            if (!current.right.right && !current.right.left) {
                current.right = null;
                return;
            }

            if (current.right.left && current.right.right) {
                const successor = this.#findSuccessorNode(current.right.right);
                this.deleteItem(successor, current.right);
                current.right.data = successor;
                return;
            }
            // This statement would work incorrect if it was above the statement of finding successor node.
            if (current.right.left || current.right.right) {
                current.right = current.right.left || current.right.right;
                return;
            }
        }

        if (value < current.data) {
            this.deleteItem(value, (current = current.left));
        } else if (value > current.data) {
            this.deleteItem(value, (current = current.right));
        }
    }

    find(value, current = this.root) {
        while (current) {
            if (current.data === value) return current;
            if (value < current.data)
                this.find(value, (current = current.left));
            if (value > current.data)
                this.find(value, (current = current.right));
        }
        return null;
    }

    levelOrder(callback, queue = [this.root]) {
        if (!(callback instanceof Function)) throw new Error("Not a callback");
        if (!queue.length) return;

        const discoveredNode = queue[0];

        if (discoveredNode.left) queue.push(discoveredNode.left);
        if (discoveredNode.right) queue.push(discoveredNode.right);

        callback(discoveredNode);
        queue.shift();

        this.levelOrder(callback, queue);
    }

    levelOrderIteration(callback) {
        if (!(callback instanceof Function)) throw new Error("Not a callback");
        const queue = [this.root];

        while (queue.length) {
            const discoveredNode = queue[0];

            if (discoveredNode.left) queue.push(discoveredNode.left);
            if (discoveredNode.right) queue.push(discoveredNode.right);

            callback(discoveredNode);
            queue.shift();
        }
    }

    inOrder(callback, current = this.root) {
        if (!(callback instanceof Function)) throw new Error("Not a callback");
        if (!current) return;

        this.inOrder(callback, current.left);
        callback(current);
        this.inOrder(callback, current.right);
    }

    preOrder(callback, current = this.root) {
        if (!(callback instanceof Function)) throw new Error("Not a callback");
        if (!current) return;

        callback(current);
        this.preOrder(callback, current.left);
        this.preOrder(callback, current.right);
    }

    postOrder(callback, current = this.root) {
        if (!(callback instanceof Function)) throw new Error("Not a callback");
        if (!current) return;

        this.postOrder(callback, current.left);
        this.postOrder(callback, current.right);
        callback(current);
    }

    height(current = this.root, nodes = 0) {
        if (!current) return nodes - 1;

        nodes += 1;
        return Math.max(
            this.height(current.left, nodes),
            this.height(current.right, nodes)
        );
    }

    depth(node, current = this.root) {
        if (!node) return null;

        if (node.data === current.data) return 0;

        if (node.data < current.data) {
            return 1 + this.depth(node, current.left);
        } else if (node.data > current.data) {
            return 1 + this.depth(node, current.right);
        }
    }

    isBalanced() {
        if (!this.root) return "Root doesn't exist";

        const left = this.height(this.root.left);
        const right = this.height(this.root.right);

        if (left >= right) {
            return left - right > 1 ? false : true;
        } else {
            return right - left > 1 ? false : true;
        }
    }

    rebalance() {
        let rebalancedTreeArray = [];

        this.inOrder((node) => {
            rebalancedTreeArray.push(node.data);
        });

        this.root = this.buildTree(rebalancedTreeArray);
    }

    prettyPrint = (node, prefix = "", isLeft = true) => {
        if (node === null) {
            return;
        }
        if (node.right !== null) {
            this.prettyPrint(
                node.right,
                `${prefix}${isLeft ? "│   " : "    "}`,
                false
            );
        }
        console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
        if (node.left !== null) {
            this.prettyPrint(
                node.left,
                `${prefix}${isLeft ? "    " : "│   "}`,
                true
            );
        }
    };
}

const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);

// const traverseCallbackData = (node) => console.log(node.data);
// const traverseCallbackNode = (node) => console.log(node);
