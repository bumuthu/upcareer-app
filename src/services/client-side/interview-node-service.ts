import { InterviewNode, UserInterviewModel } from "../../models/entities";
import { PrivateRestService } from "./api-services/private-rest-service";
import { v4 as uuidv4 } from 'uuid';
import { debounce } from 'lodash';

export type FormattedTreeData = {
    id: string;
    depth: number;
    node: InterviewNode;
    children?: FormattedTreeData[];
};

export class InterviewNodeService {
    private nodes: { [id: string]: InterviewNode } = {};
    private currentNodeId?: string;
    private privateService: PrivateRestService = new PrivateRestService();
    private userInterview: UserInterviewModel;

    constructor(userInterview: UserInterviewModel) {
        this.userInterview = userInterview;
        this.nodes = userInterview.nodes ?? {};
        this.currentNodeId = userInterview.currentNodeId;
    }

    addNode(previousNodeId: string | null, node: InterviewNode) {
        if (previousNodeId == null) {
            this.nodes[node.id] = node;
        } else {
            node.previousNodeId = previousNodeId;
            const nextNodeId = this.nodes[previousNodeId].nextNodeId
            if (nextNodeId) {
                node.nextNodeId = nextNodeId;
                if (this.nodes[nextNodeId]) {
                    this.nodes[nextNodeId].previousNodeId = node.id;
                }
            }
            this.nodes[previousNodeId].nextNodeId = node.id;
            this.nodes[node.id] = node;
        }
        this.debouncedUpdatUserInterview();
    }

    setCurrentNodeId(id: string) {
        this.currentNodeId = id;
        this.updateUserInterview();
    }

    generateNodeId() {
        return uuidv4();
    }

    getCurrentNode() {
        return this.nodes[this.currentNodeId!];
    }

    getNode(id: string) {
        return this.nodes[id];
    }

    getAllNodes() {
        return this.nodes;
    }

    updateCurrentNode(update: InterviewNode) {
        this.nodes[this.currentNodeId!] = { ...this.nodes[this.currentNodeId!], ...update };
        this.updateUserInterview();
    }

    updateNode(id: string, update: InterviewNode) {
        this.nodes[id] = { ...this.nodes[id], ...update };
        this.updateUserInterview();
    }

    activateNextNode(feedback?: string) {
        const nextNodeId = this.nodes[this.currentNodeId!].nextNodeId
        if (nextNodeId) {
            this.currentNodeId = nextNodeId;
            this.nodes[this.currentNodeId!].previousAnswerFeedback = feedback;
            this.updateUserInterview();
            return this.nodes[this.currentNodeId!]
        }
        return null;
    }

    formatTree(): FormattedTreeData[] {
        const formattedTree: FormattedTreeData[] = []
        // Setting parent nodes
        for (const id in this.nodes) {
            const node = this.nodes[id];
            if (!node.isParentNode) continue;
            formattedTree.push({
                id: node.id,
                depth: 1,
                node: node,
                children: []
            })
        }
        // Setting child nodes
        for (const id in this.nodes) {
            const node = this.nodes[id];
            if (node.isParentNode) continue;
            const elementIndex = formattedTree.findIndex(x => x.id == node.parentNodeId);
            formattedTree[elementIndex]?.children?.push({
                id: node.id,
                depth: 2,
                node: node
            })
        }
        return formattedTree;
    }

    private debouncedUpdatUserInterview = debounce(this.updateUserInterview.bind(this), 1000)

    private async updateUserInterview() {
        this.privateService.updateUserInterview({ userInterviewId: this.userInterview._id, nodes: this.nodes, currentNodeId: this.currentNodeId });
    }
}