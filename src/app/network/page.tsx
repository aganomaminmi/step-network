'use client'

import { useEffect, useMemo, useState } from "react";
import { User, UserRelationship } from "@prisma/client";
import CytoscapeComponent from "react-cytoscapejs";
import {
  ElementDefinition,
  LayoutOptions,
  NodeDataDefinition,
} from "cytoscape";
import { map } from "@/lib/utils/map";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [relationship, setRelationship] = useState<UserRelationship[]>([]);
  const [layout, setLayout] = useState<LayoutOptions | undefined>(undefined);

  useEffect(() => {
    fetch("/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res: any) => {
      res.json().then((data: any) => {
        setUsers(data.users);
      });
    });
    fetch("/api/user_relationships", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res: any) => {
      res.json().then((data: any) => {
        console.log(data);
        setRelationship(data.relationship);
      });
    });
  }, []);

  const elements = useMemo<ElementDefinition[]>(() => {
    if (!users || !relationship) {
      return [];
    }
    const nodes: { data: NodeDataDefinition }[] = users.map((user) => ({
      data: { id: String(user.id), label: user.name },
      style: {
        position: { x: 200, y: 200 },
        backgroundColor: user.name.includes("A")
          ? "red"
          : user.name.includes("B")
            ? "blue"
            : "green",
      },
    }));
    const edges = relationship
      .filter((rel) => !!rel.score)
      .map((rel) => ({
        data: {
          source: rel.from_user_id,
          target: rel.target_user_id,
          label: rel.score.toString(),
        },
        style: {
          width: map(rel.score, 1, 300, 1, 4),

        }
      }));
    return CytoscapeComponent.normalizeElements({ nodes: nodes, edges });
  }, [users, relationship]);

  useEffect(() => {
    setLayout({ name: "null" });
    setLayout({ name: "breadthfirst" });
  }, [elements]);

  // const elements = [
  //   {
  //     data: { id: 'three', label: 'Node 3' },
  //     position: { x: 200, y: 100 },
  //     style: {
  //       width: 20,
  //       height: 20,
  //       shape: 'rectangle',
  //       backgroundColor: 'red',
  //       borderColor: 'black',
  //       borderWidth: 3
  //     }
  //   },
  //   {
  //     data: { source: 'two', target: 'three', label: 'Edge from Node2 to Node3' },
  //     style: {
  //       width: 10,
  //       lineColor: 'green',
  //       lineStyle: 'dashed'
  //     }
  //   }
  // ];

  return (
    <main>
      {elements && elements.length > 0 && (
        <CytoscapeComponent
          elements={elements}
          style={{ height: "200vh", width: "200vw" }}
          layout={{ name: "cose" }}
        />
      )}
    </main>
  );
}
