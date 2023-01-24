import { useRouter } from "next/router";

import { usePublicProjectBySlugQuery } from "lib/services/publicProject";
import { getFirstQueryParam } from "lib/utils";

// TODO:
// 1. contract -> get instantiator
// 2. code -> get uploader
// 3. code -> get contract amount that instantiated from this code ID
// 4. code -> get permission and render the right tag (already has UI)

export const usePublicData = () => {
  const router = useRouter();
  const projectSlug = getFirstQueryParam(router.query.slug);
  const { data: projectInfo } = usePublicProjectBySlugQuery(projectSlug);

  return {
    publicCodes: projectInfo?.codes || [],
    publicContracts: projectInfo?.contracts || [],
    projectDetail: projectInfo?.details,
    slug: projectSlug,
  };
};