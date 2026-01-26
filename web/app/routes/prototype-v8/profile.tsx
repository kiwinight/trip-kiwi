import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui";

export default function ProfilePage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      {Array.from({ length: 30 }, (_, i) => (
        <Card key={i} size="sm">
          <CardHeader>
            <CardTitle>Profile Item {i + 1}</CardTitle>
            <CardDescription>Scroll test content for item {i + 1}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
