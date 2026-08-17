import { supabase } from "@/lib/supabase";
import { Profile } from "@/types";

export async function fetchDiscoverableUserRankings() {
  const { data, error } = await supabase
    .from("user_rankings")
    .select()
    .eq("discoverable", true);

  if (error) {
    console.error("Failed to fetch discoverable rankings:", error);
    throw error;
  }

  // convert snake case to camel case
  const correctedData = data?.map((ranking) => {
    return {
      ...ranking,
      createdAt: ranking.created_at,
      rankedUtensils: ranking.ranked_utensils,
      winnersHistory: ranking.winners_history,
      userID: ranking.user_id,
    };
  });

  return correctedData;
}

export async function fetchDiscoverableUserSets() {
  const { data, error } = await supabase
    .from("user_sets")
    .select()
    .eq("discoverable", true);

  if (error) {
    console.error("Failed to fetch discoverable sets:", error);
    throw error;
  }

  // convert snake case to camel case
  const correctedData = data?.map((set) => {
    return {
      ...set,
      createdAt: set.created_at,
      userID: set.user_id,
    };
  });

  return correctedData;
}

export async function fetchOwnedUserRankings(userID: string) {
  const { data, error } = await supabase
    .from("user_rankings")
    .select()
    .eq("user_id", userID);

  if (error) {
    console.error("Failed to fetch current user's rankings:", error);
    throw error;
  }

  // convert snake case to camel case
  const correctedData = data?.map((ranking) => {
    return {
      ...ranking,
      createdAt: ranking.created_at,
      rankedUtensils: ranking.ranked_utensils,
      winnersHistory: ranking.winners_history,
      userID: ranking.user_id,
    };
  });

  return correctedData;
}

export async function fetchOwnedUserSets(userID: string) {
  const { data, error } = await supabase
    .from("user_sets")
    .select()
    .eq("user_id", userID);

  if (error) {
    console.error("Failed to fetch current user's sets:", error);
    throw error;
  }

  // convert snake case to camel case
  const correctedData = data?.map((set) => {
    return {
      ...set,
      createdAt: set.created_at,
      userID: set.user_id,
    };
  });

  return correctedData;
}

export async function fetchCurrentProfile() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return;

  const user = session.user;

  const { data, error } = await supabase
    .from("profiles")
    .select()
    .eq("id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Failed to fetch profile:", error);
    throw error;
  }

  // convert snake case to camel case
  const { created_at, owned_rankings, owned_sets, ...rest } = data || {};
  const profileData = {
    ...rest,
    createdAt: created_at,
    ownedRankings: owned_rankings,
    ownedSets: owned_sets,
  };

  const email = user.email;

  return { profileData, email };
}

export async function insertUserRankings(newRanking: any) {
  const { error } = await supabase
    .from("user_rankings")
    .insert(newRanking)
    .select();

  if (error) {
    console.error("Failed to insert into user rankings:", error);
    throw error;
  }
}

export async function insertUserSets(newSet: any) {
  const { error } = await supabase.from("user_sets").insert(newSet).select();

  if (error) {
    console.error("Failed to insert into user sets:", error);
    throw error;
  }
}

export async function updateCurrentOwnedRankings(
  rankingID: number,
  profile: Profile,
) {
  const { error } = await supabase
    .from("profiles")
    .update({
      owned_rankings:
        // add new ranking ID to owned_rankings array
        [rankingID, ...profile.ownedRankings],
    })
    .eq("id", profile.id);

  if (error) {
    console.error("Failed to update owned rankings:", error);
    throw error;
  }
}

export async function updateCurrentOwnedSets(setID: string, profile: Profile) {
  const { error } = await supabase
    .from("profiles")
    .update({
      owned_sets:
        // add new set ID to owned_rankings array
        [setID, ...profile.ownedSets],
    })
    .eq("id", profile.id);

  if (error) {
    console.error("Failed to update owned sets:", error);
    throw error;
  }
}

export async function fetchRanking(rankingID: number) {
  const { data, error } = await supabase
    .from("user_rankings")
    .select()
    .eq("id", rankingID)
    .single();

  if (error) {
    console.error("Failed to fetch ranking:", error);
    throw error;
  }

  // convert snake case to camel case
  const { created_at, ranked_utensils, winners_history, user_id, ...rest } =
    data || {};
  const correctedData = {
    ...rest,
    createdAt: created_at,
    rankedUtensils: ranked_utensils,
    winnersHistory: winners_history,
    userID: user_id,
  };

  return correctedData;
}

export async function fetchSet(setID: string) {
  const { data, error } = await supabase
    .from("user_sets")
    .select()
    .eq("id", setID)
    .single();

  if (error) {
    console.error("Failed to fetch set:", error);
    throw error;
  }

  // convert snake case to camel case
  const { created_at, user_id, ...rest } = data || {};
  const correctedData = {
    ...rest,
    createdAt: created_at,
    userID: user_id,
  };

  return correctedData;
}

export async function deleteRanking(profile: Profile, rankingID: number) {
  const { error: error1 } = await supabase
    .from("user_rankings")
    .delete()
    .eq("id", rankingID)
    .single();

  if (error1) {
    console.error("Failed to delete from user_rankings:", error1);
    throw error1;
  }

  const { error: error2 } = await supabase
    .from("profiles")
    .update({
      owned_rankings:
        // remove set ID from owned_rankings array
        [...profile.ownedRankings].filter((id) => id !== rankingID),
    })
    .eq("id", profile.id);

  if (error2) {
    console.error("Failed to update owned rankings:", error2);
    throw error2;
  }
}

export async function deleteSet(profile: Profile, setID: string) {
  const { error: error1 } = await supabase
    .from("user_sets")
    .delete()
    .eq("id", setID)
    .single();

  if (error1) {
    console.error("Failed to delete set:", error1);
    throw error1;
  }

  const { error: error2 } = await supabase
    .from("profiles")
    .update({
      owned_sets:
        // remove set ID from owned_sets array
        [...profile.ownedSets].filter((id) => id !== setID),
    })
    .eq("id", profile.id);

  if (error2) {
    console.error("Failed to update owned sets:", error2);
    throw error2;
  }
}
