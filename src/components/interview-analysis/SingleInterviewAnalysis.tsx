'use client'

import React, { useEffect, useRef, useState } from 'react'
import { G6, IndentedTree, IndentedTreeOptions } from '@ant-design/graphs';
import { Graph } from '@antv/g6';
import { useInterviewContext } from '../../context/InterviewContext';

const { treeToGraphData } = G6;

const SingleInterviewAnalysis = () => {
    const [data, setData] = useState<any>();
    const [graphSize, setGraphSize] = useState({ width: 500, height: 1000 });
    const isMounted = useRef(false);
    const interviewContext = useInterviewContext();

    useEffect(() => {
            isMounted.current = true;
    }, []);

    useEffect(() => {
        if (interviewContext.interviewNodeService) {
            setData(treeToGraphData(interviewContext.interviewNodeService!.formatTree()))
        }
    }, [interviewContext.interviewNodeService])

    // Documentation: https://ant-design-charts.antgroup.com/en/examples/relations/indented-tree/#collapse-expand
    const options: IndentedTreeOptions = {
        type: 'boxed',
        autoFit: 'view',
        animation: false,
        zoom: 0.1,
        data: data!,
        node: {
            style: {
            }
        },
        onReady: (graph: Graph) => {
            graph.on('node:click', (evt: any) => {
                console.log("Clicked on node:", evt.target.id)
            });
            const size = graph.getCanvas().getSize();
            if (graphSize.width != size[0] || graphSize.height != size[1]) {
                setGraphSize({ width: size[0], height: size[1] })
            }
        },
        onDestroy: () => {
        },
        behaviors: [],
    };

    return (
        <div style={{ height: graphSize.height, width: '600px', cursor: "pointer" }}>
            {isMounted.current && data && <IndentedTree {...options} />}
        </div>
    )
}

export default SingleInterviewAnalysis;