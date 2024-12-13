import React from "react";

export type Data = {
  postId: string;
  id: string;
  name: string;
  email: string;
  body: string;
};

interface CardProps {
  data: Data;
}

const Card: React.FC<CardProps> = ({ data }) => {
  return (
    <div className="card">
      <h3>{data.name}</h3>
      <p>
        <strong>ID:</strong> <br />
        {data.id}
      </p>
      <p>
        <strong>Post ID:</strong> <br />
        {data.postId}
      </p>
      <p>
        <strong>Email:</strong>
        <br /> {data.email}
      </p>
      <p>
        <strong>Body:</strong> <br />
        {data.body.replace(/\\n/g, " ")}
      </p>
    </div>
  );
};

export default Card;
