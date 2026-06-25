import { PageHeader } from "@/components/ui/page-header";
import { getOnboardingTasks } from "@/lib/data/queries";
import { OnboardingClient } from "./onboarding-client";

export default async function OnboardingPage() {
  const tasks = await getOnboardingTasks();

  return (
    <>
      <PageHeader
        title="Onboarding"
        description="Get set up for success in your first week."
      />
      <OnboardingClient initial={tasks} />
    </>
  );
}
