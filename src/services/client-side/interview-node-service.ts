import { BaseInterviewModel, InterviewNode, UserInterviewModel } from "../../models/entities";
import { PrivateRestService } from "./api-services/private-rest-service";
import { v4 as uuidv4 } from 'uuid';
import { debounce } from 'lodash';

export type FormattedTreeData = {
    id: string;
    depth: number;
    originalId: string;
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
            this.nodes[previousNodeId].nextNodeId = node.id;

            const nextNodeId = this.nodes[previousNodeId].nextNodeId
            if (nextNodeId) {
                node.nextNodeId = nextNodeId;
                if (this.nodes[nextNodeId]) {
                    this.nodes[nextNodeId].previousNodeId = node.id;
                }
            }
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

    activateNextNode() {
        const nextNodeId = this.nodes[this.currentNodeId!].nextNodeId
        if (nextNodeId) {
            this.currentNodeId = nextNodeId;
            this.updateUserInterview();
            return this.nodes[this.currentNodeId!]
        }
        return null;
    }

    formatTree() {
        const formattedTree: FormattedTreeData = {
            id: (this.userInterview?.baseInterview as BaseInterviewModel).title,
            depth: 0,
            originalId: 'root',
            children: []
        };
        // Setting parent nodes
        for (const id in this.nodes) {
            const node = this.nodes[id];
            if (node.parentNodeId) continue;
            formattedTree.children?.push({
                id: node.question,
                depth: 1,
                originalId: node.id,
                children: []
            })
        }
        // Setting child nodes
        for (const id in this.nodes) {
            const node = this.nodes[id];
            if (!node.parentNodeId) continue;
            formattedTree.children?.find(x => x.originalId == node.parentNodeId)?.children?.push({
                id: node.question,
                depth: 2,
                originalId: node.id,
            })
        }
        return formattedTree;
    }

    private debouncedUpdatUserInterview = debounce(this.updateUserInterview.bind(this), 1000)

    private async updateUserInterview() {
        this.privateService.updateUserInterview({ userInterviewId: this.userInterview._id, nodes: this.nodes, currentNodeId: this.currentNodeId });
    }
}