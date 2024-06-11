"use client";

import {
  ChangeEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { parse } from "papaparse";
import { StepData } from "@/app/api/users/route";
import dayjs from "dayjs";
import { User, UserRelationship } from "@prisma/client";
import { DataSet } from "vis-data";
import { Network } from "vis-network";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [relationship, setRelationship] = useState<UserRelationship[]>([]);
  const [network, setNetwork] = useState<any>(null);

  const networkRef = useRef<HTMLDivElement>(null);

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
        setRelationship(data.relationships);
      });
    });
  }, []);

  useEffect(() => {

    if (!users || !relationship) {
      return;
    }
    if (!network && networkRef.current) {
      // users.forEach((user) => {
      //   console.log(user)
      //   })

      // const _users = []
      // for (const user of users) {
      //   console.log(user)
      //   _users.push({ id: user.id, label: user.name });

      // }
      console.log('fuck')

      const nodes = new DataSet(
        users.map((user) => ({ id: user.id, label: user.name }))
      );
      const edges = new DataSet(
        relationship.map((rel) => ({
          id: rel.id,
          from: rel.from_user_id,
          to: rel.target_user_id,
          label: rel.score.toString(),
        }))
      );


      console.log(nodes, edges)
      const network = new Network(
        networkRef.current,
        {
          nodes: nodes,
          edges: edges,
        },
        {
          physics: {
            barnesHut: {
              gravitationalConstant: -4000,
            },
          },
          interaction: {
            multiselect: true,
          },
        }
      );

      setNetwork(network);
      console.log("Network Created");
    }
  }, [users, relationship]);

  return (
    <main >
      <div ref={networkRef} style={{ width: "100vw", height: "100vh" }}></div>
    </main>
  );
}
