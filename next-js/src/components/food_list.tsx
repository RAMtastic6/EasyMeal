"use client";

export default function FoodList(props: any) {
  return (
    <div className="rounded-lg bg-white shadow-lg p-12 space-y-4">
      <h2 className="text-2xl font-bold text-orange-950 text-center">Menu: </h2>
      <div className="container mx-auto">
        <ul>
          {" "}
          {props.menu.map((item: any) => (
            <li className="bg-white p-4" key={item["id"]}>
              {" "}
              {item["name"]} - {item["price"]} {"€"} 
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
