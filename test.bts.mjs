import Tree from "./binaryTree.mjs";

const tree = new Tree([
    769, 717, 594, 637, 841, 842, 549, 631, 816, 653, 837, 590,
]);
console.log(tree.isBalanced());

console.log(tree.levelOrder((node) => console.log(node.data)));
console.log(tree.preOrder((node) => console.log(node.data)));
console.log(tree.postOrder((node) => console.log(node.data)));
console.log(tree.inOrder((node) => console.log(node.data)));
tree.insert(42);
tree.insert(34);
tree.insert(3);
tree.insert(68);
tree.insert(84);
tree.insert(17);
tree.insert(5);
console.log(tree.isBalanced());
tree.rebalance();
console.log(tree.isBalanced());
console.log(tree.levelOrder((node) => console.log(node.data)));
console.log(tree.preOrder((node) => console.log(node.data)));
console.log(tree.postOrder((node) => console.log(node.data)));
console.log(tree.inOrder((node) => console.log(node.data)));
tree.prettyPrint(tree.root);
