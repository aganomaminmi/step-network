"use client";

import { ChangeEventHandler, useEffect, useState } from "react";
import { parse } from "papaparse";
import { StepData } from "./api/users/route";
import dayjs from "dayjs";

export default function Home() {
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [stepData, setStepData] = useState<Array<StepData>>([]);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, csv: stepData }),
    }).then((res: any) => {
      res.json().then((data: any) => {
        setUsers(data);
      });
    });
  }, []);

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.currentTarget.files;
    if (!files || files?.length === 0) return;

    setError(null);

    const file = files[0];
    parse<[string, string, string]>(file, {
      complete: (results) => {
        const headerArray = ["date", "time", "steps"];
        const data = results.data.slice();
        const header = data.shift();

        if (!header) return setError("Invalid file format");
        const checkHeader = headerArray.every((h, i) => h === header[i]);

        if (!checkHeader) {
          setError("Invalid file format");
        }

        const requestBody = data
          .filter((row) => row.length === 3)
          .map((row: Array<string>) => {
            const [date, time, steps] = row;
            const day = dayjs(`${date} ${time}`, "YYYY-MM-DD HH:mm:ss");
            return {
              datetime: day.format(),
              step: Number(steps),
            };
          });
        setStepData(requestBody);
      },
      error: (error) => {
        setError(error.message);
      },
    });
    setName(file.name);
  };

  const createUser = async () => {
    setLoading(true);
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, csv: stepData }),
    });

    const user = await response.json();
    setLoading(false);
    setResponse(user);
  };

  const createRelation = async () => {
    setLoading(true);
    const response = await fetch("/api/user_relationships", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-4">
      <pre>{JSON.stringify(users, null, 2)}</pre>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <p>{name}</p>
      <p>{!!stepData.length && "parse ok"}</p>
      <p>{error}</p>
      <button
        className="bg-white text-black px-4 py-1 rounded"
        onClick={createUser}
      >
        create
      </button>
      {loading && <p>loading...</p>}
      {!!response && (
        <div>
          response <br />
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      <button
        className="bg-white text-black px-4 py-1 rounded"
        onClick={createRelation}
      >
        create relation
      </button>
    </main>
  );
}
