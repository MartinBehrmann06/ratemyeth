import ethData from "@/assets/eth_all_departments.json";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";

const deptNames: Record<string, string> = {
  arch: "Architecture",
  baug: "Civil, Environmental and Geomatic Engineering",
};

export default function Dashboard() {
  const departments = ethData as Record<string, any>;

  return (
    <main className="min-h-screen bg-background p-8 md:p-12 lg:p-24">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">ETH Directory</h1>
          <p className="text-muted-foreground">
            Browse professors and staff by department.
          </p>
        </div>

        <Accordion type="multiple" className="w-full space-y-4 border-none">
          {Object.entries(departments).map(([deptKey, deptData]) => (
            <AccordionItem
              key={deptKey}
              value={deptKey}
              className="border rounded-lg px-6 bg-card mx-2"
            >
              <AccordionTrigger className="text-xl font-semibold hover:no-underline mx-2">
                {deptNames[deptKey] || deptKey.toUpperCase()}
                <span className="ml-4 text-sm font-normal text-muted-foreground">
                  ({deptData.data?.length || 0} members)
                </span>
              </AccordionTrigger>

              <AccordionContent className="pt-4 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {deptData.data?.map((person: any) => {
                    const attr = person.attributes;
                    const imageUrl = attr.image
                      ? `https://ethz.ch${attr.image}`
                      : null;
                    const initials = attr.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .substring(0, 2);

                    return (
                      <Card key={attr.id} className="overflow-hidden">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                          {/* Replaced Avatar with Next Image & Custom Fallback */}
                          <div className="relative flex h-[200px] w-[140px] shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={attr.name}
                                fill
                                className="object-cover"
                                sizes="56px"
                                unoptimized
                              />
                            ) : (
                              <span className="text-sm font-medium text-muted-foreground">
                                {initials}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-col">
                            <h3 className="font-semibold leading-tight">
                              {attr.name}
                            </h3>
                          </div>
                        </CardHeader>

                        <CardContent className="text-sm text-muted-foreground space-y-2 mt-2">
                          {/* ... Contact details remain the same ... */}
                          {attr.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <a
                                href={`mailto:${attr.email}`}
                                className="hover:text-primary truncate"
                              >
                                {attr.email}
                              </a>
                            </div>
                          )}
                          {attr.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{attr.phone}</span>
                            </div>
                          )}
                          {attr.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{attr.location}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </main>
  );
}
