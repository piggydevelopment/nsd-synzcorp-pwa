import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Loading from "../parts/loading";
import { BrowserRouter as Router, useNavigate, Link } from "react-router-dom";
import api from "../../utils/api";
import Banner from "../parts/banners";
import { ReactSession } from "react-client-session";
import { Specialist } from "../parts/specialist";
import CachedIcon from "@mui/icons-material/Cached";
import IconButton from "@mui/material/IconButton";
import Chat from "./chat";
export function HomePage() {
  const [banners, setBanners] = useState(
    localStorage.getItem("banners")
      ? JSON.parse(localStorage.getItem("banners"))
      : [],
  );
  const [knowledges, setKnowledges] = useState(
    localStorage.getItem("knowledges")
      ? JSON.parse(localStorage.getItem("knowledges"))
      : [],
  );
  const [user, setUser] = useState(ReactSession.get("user"));
  const [isLoading, setIsLoading] = useState(true);
  const [specialists, setSpecialists] = useState({});
  const [orgSettings, setOrgSettings] = useState(
    JSON.parse(localStorage.getItem("organization_settings")) || {},
  );

  const navigate = useNavigate();

  const specialistTypes = orgSettings.organization_specialist_type || [];

  useEffect(() => {
    !user && navigate("/login");
    isLoading && initialize();
  }, [0]);

  const initialize = async () => {
    let last_update = localStorage.getItem("last_update") || null;
    // check if now is 16.00
    let now = new Date();
    let hour = now.getHours();
    if (hour >= 16) {
      updateHandle();
    }

    if (Date.now() - last_update > 3600000 || last_update === null) {
      await updateHandle();
    } else {
      await getBanners();
      await getKnowledges();
      for (const type of specialistTypes) {
        await getSpecialist(type.id);
      }
    }
    setIsLoading(false);
    forceUpdateInfo();

    return;
  };

  const getOrgSettings = async () => {
    try {
      const response = await api.get(
        `/api/organization/data?includes=info,organization_specialist_type,segments`,
      );
      if (response.data && response.data.data) {
        const data = response.data.data;
        localStorage.setItem("organization_settings", JSON.stringify(data));
        localStorage.setItem(
          "org_settings_last_update",
          new Date().toISOString().split("T")[0],
        );
        setOrgSettings(data);
        return data;
      }
    } catch (error) {
      console.error("Failed to fetch organization settings:", error);
    }
    return orgSettings;
  };

  const updateHandle = async () => {
    setIsLoading(true);
    const newSettings = await getOrgSettings();
    const newTypes = newSettings?.organization_specialist_type || [];

    // 2. Clear caches
    await localStorage.removeItem("banners");
    await localStorage.removeItem("knowledges");
    // Clear all old specialist caches
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith("specialist_type_")) {
        localStorage.removeItem(key);
      }
    }
    await localStorage.setItem("last_update", Date.now());

    // 3. Re-fetch everything
    await getBanners();
    await getKnowledges();
    for (const type of newTypes) {
      await getSpecialist(type.id);
    }

    setIsLoading(false);
    return;
  };

  const forceUpdateInfo = async () => {
    if (Number(user.is_active) === 0 || user.is_active === 0) {
      alert("บัญชีของคุณถูกระงับ กรุณาติดต่อผู้ดูแลระบบ");
      await ReactSession.remove("user");
      await localStorage.removeItem("user");
      await localStorage.removeItem("banners");
      await localStorage.removeItem("email");
      await localStorage.removeItem("ref");
      await localStorage.removeItem("last_update");

      navigate("/login");
    }

    if (user) {
      if (
        user.attribute_1 === null ||
        user.firstname === null ||
        user.lastname === null ||
        user.phone_number === null
      ) {
        navigate("/update");
      }
    }
  };

  const getBanners = async () => {
    try {
      let local_banners = await localStorage.getItem("banners");
      if (local_banners) {
        let parsed_banners = JSON.parse(local_banners);
        if (parsed_banners.length > 0 && parsed_banners[0].image_url) {
          await setBanners(parsed_banners);
          return;
        }
      }

      let getBannersData = await api.get("/api/banners");
      getBannersData = getBannersData.data.data;
      await setBanners(getBannersData);
      await localStorage.setItem("banners", JSON.stringify(getBannersData));
      return;
    } catch (error) {
      console.error(error);
    }
  };

  const getKnowledges = async () => {
    try {
      let local_knowledges = await localStorage.getItem("knowledges");
      if (local_knowledges) {
        let parsed_knowledges = JSON.parse(local_knowledges);
        if (parsed_knowledges.length > 0) {
          await setKnowledges(parsed_knowledges);
          return;
        }
      }

      let getKnowledgesData = await api.get("/api/knowledges");
      getKnowledgesData = getKnowledgesData.data.data;
      await setKnowledges(getKnowledgesData);
      await localStorage.setItem(
        "knowledges",
        JSON.stringify(getKnowledgesData),
      );
      return;
    } catch (error) {
      console.error(error);
    }
  };

  const getSpecialist = async (typeId) => {
    try {
      let localSpecialist = await localStorage.getItem(
        "specialist_type_" + typeId,
      );

      if (localSpecialist) {
        let parsedSpecialist = JSON.parse(localSpecialist);
        if (Array.isArray(parsedSpecialist) && parsedSpecialist.length > 0) {
          setSpecialists((prev) => ({
            ...prev,
            [typeId]: parsedSpecialist,
          }));
          return;
        }
      }

      let getSpecialistData = await api.get("/api/specialist/type/" + typeId);
      getSpecialistData = getSpecialistData.data.data;

      setSpecialists((prev) => ({
        ...prev,
        [typeId]: getSpecialistData,
      }));

      await localStorage.setItem(
        "specialist_type_" + typeId,
        JSON.stringify(getSpecialistData),
      );
      return;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#F6F6F6", pb: 5 }}>
      <Chat />
      {isLoading ? <Loading /> : null}
      <div
        style={{
          marginBottom: "10px",
          flex: "1",
          justifyContent: "flex-start",
          flexDirection: "row",
          display: "flex",
          justifyItems: "center",
          alignItems: "center",
        }}
      >
        <img
          src={
            orgSettings?.organization_information?.icon_url || "images/logo.png"
          }
          style={{ width: "104px" }}
        />
        <div style={{ marginLeft: "10px" }}>
          สุขภาพใจของเธอ ให้{" "}
          <span style={{ color: "#461E99", fontWeight: 800 }}>
            {orgSettings?.organization_information?.name || "SynZ"}
          </span>{" "}
          ดูแลนะ
        </div>
        <IconButton
          onClick={updateHandle}
          sx={{
            position: "absolute",
            right: 10,
          }}
        >
          <CachedIcon />
        </IconButton>
      </div>
      <div
        style={{
          paddingLeft: "20px",
          justifyContent: "flex-start",
          flexDirection: "row",
          display: "flex",
          fontSize: "18px",
          fontWeight: 600,
        }}
      >
        {!user.firstname ? (
          <Link to="/update" style={{ color: "red", textDecoration: "none" }}>
            กรุณาอัปเดทข้อมูล ⚠️
          </Link>
        ) : (
          "สวัสดี, " + user.firstname + " " + user.lastname
        )}
      </div>

      {banners.length > 0 ? <Banner data={banners} /> : null}

      {knowledges.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <div
            className="ts2"
            style={{ marginLeft: "20px", marginBottom: "10px" }}
          >
            สาระน่ารู้
          </div>
          <Banner
            data={knowledges.map((k) => ({
              ...k,
              image_url: k.content_url,
              name: k.title,
            }))}
          />
        </Box>
      )}

      {specialistTypes.map((type) =>
        specialists[type.id] && specialists[type.id].length > 0 ? (
          <Specialist
            key={type.id}
            type={type.name}
            data={specialists[type.id]}
          />
        ) : null,
      )}
    </Box>
  );
}
