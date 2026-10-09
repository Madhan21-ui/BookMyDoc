import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    Search, X, MapPin, Building2, GraduationCap, BadgeCheck, ArrowRight, Star, SearchX,
} from "lucide-react";
import api from "../services/api";
import "../style/Doctors.css";

const norm = (v) => String(v || "").trim().toLowerCase();

// "Cardiologist" and "Cardiology" should still match each other
const looseMatch = (a, b) => {
    const x = norm(a);
    const y = norm(b);
    return !!x && !!y && (x === y || x.includes(y) || y.includes(x) || x.slice(0, 5) === y.slice(0, 5));
};

function initialOf(name = "") {
    return (name.replace(/^dr\.?\s*/i, "").trim()[0] || "D").toUpperCase();
}

function Doctors() {
    const [params] = useSearchParams();

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);

    // The landing page sends ?speciality= and ?city=
    const [search, setSearch] = useState(params.get("city") || "");
    const [speciality, setSpeciality] = useState("ALL");
    const [sort, setSort] = useState("DEFAULT");
    const wantedSpeciality = params.get("speciality");

    useEffect(() => {
        api
            .get("/doctors")
            .then((r) => setDoctors(r.data || []))
            .catch((e) => {
                console.error(e);
                setFailed(true);
            })
            .finally(() => setLoading(false));
    }, []);

    const specialities = useMemo(
        () => [...new Set(doctors.map((d) => d.specialization).filter(Boolean))],
        [doctors]
    );

    // Turn ?speciality=Cardiologist into the matching chip once doctors are loaded
    useEffect(() => {
        if (!wantedSpeciality || specialities.length === 0) return;
        const hit = specialities.find((s) => looseMatch(s, wantedSpeciality));
        if (hit) setSpeciality(hit);
        else setSearch((s) => s || wantedSpeciality);
    }, [wantedSpeciality, specialities]);

    const filtered = useMemo(() => {
        const q = norm(search);
        return doctors
            .filter((d) => {
                const okSpec = speciality === "ALL" || d.specialization === speciality;
                const okSearch =
                    !q ||
                    [d.name, d.specialization, d.hospitalName, d.location].some((v) => norm(v).includes(q));
                return okSpec && okSearch;
            })
            .sort((a, b) => {
                if (sort === "EXPERIENCE") return Number(b.experience) - Number(a.experience);
                if (sort === "NAME") return (a.name || "").localeCompare(b.name || "");
                return 0;
            });
    }, [doctors, search, speciality, sort]);

    const hasFilters = search || speciality !== "ALL";
    const reset = () => {
        setSearch("");
        setSpeciality("ALL");
    };

    return (
        <main className="dc">
            {/* ---------- Header + search ---------- */}
            <header className="dc-head">
                <div className="dc-wrap">
                    <p className="dc-kicker">
                        <BadgeCheck size={16} /> Verified specialists
                    </p>
                    <h1>Find the right doctor for you</h1>
                    <p className="dc-lead">
                        Search by name, speciality, hospital or area, then book a time that works.
                    </p>

                    <div className="dc-search">
                        <Search size={19} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search doctors, hospitals or locations"
                            aria-label="Search doctors"
                        />
                        {search && (
                            <button type="button" onClick={() => setSearch("")} aria-label="Clear search">
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <div className="dc-wrap">
                {/* ---------- Toolbar ---------- */}
                <div className="dc-toolbar">
                    <div className="dc-chips" role="tablist" aria-label="Speciality">
                        <button
                            role="tab"
                            aria-selected={speciality === "ALL"}
                            className={`dc-chip ${speciality === "ALL" ? "is-active" : ""}`}
                            onClick={() => setSpeciality("ALL")}
                        >
                            All
                        </button>
                        {specialities.map((s) => (
                            <button
                                key={s}
                                role="tab"
                                aria-selected={speciality === s}
                                className={`dc-chip ${speciality === s ? "is-active" : ""}`}
                                onClick={() => setSpeciality(s)}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <label className="dc-sort">
                        <span>Sort by</span>
                        <select value={sort} onChange={(e) => setSort(e.target.value)}>
                            <option value="DEFAULT">Recommended</option>
                            <option value="EXPERIENCE">Most experienced</option>
                            <option value="NAME">Name (A to Z)</option>
                        </select>
                    </label>
                </div>

                {!loading && !failed && (
                    <p className="dc-count" aria-live="polite">
                        Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? "doctor" : "doctors"}
                        {hasFilters && (
                            <button className="dc-reset" onClick={reset}>Clear filters</button>
                        )}
                    </p>
                )}

                {/* ---------- Results ---------- */}
                {loading ? (
                    <div className="dc-grid" aria-busy="true">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="dc-card dc-skel">
                                <span className="dc-skel__circle" />
                                <span style={{ width: "55%" }} />
                                <span style={{ width: "35%" }} />
                                <span style={{ width: "90%", height: 70 }} />
                            </div>
                        ))}
                    </div>
                ) : failed ? (
                    <div className="dc-empty">
                        <span className="dc-empty__icon"><SearchX size={28} /></span>
                        <h2>We could not load doctors</h2>
                        <p>Please check your connection and try again.</p>
                        <button className="dc-btn dc-btn--primary" onClick={() => window.location.reload()}>
                            Try again
                        </button>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="dc-empty">
                        <span className="dc-empty__icon"><SearchX size={28} /></span>
                        <h2>No doctors found</h2>
                        <p>Try a different search or speciality.</p>
                        {hasFilters && (
                            <button className="dc-btn dc-btn--primary" onClick={reset}>Clear filters</button>
                        )}
                    </div>
                ) : (
                    <div className="dc-grid">
                        {filtered.map((d, i) => (
                            <article key={d.id} className="dc-card" style={{ "--i": Math.min(i, 8) }}>
                                <div className="dc-card__top">
                                    <span className="dc-avatar">{initialOf(d.name)}</span>
                                    <div className="dc-card__id">
                                        <h2>
                                            {d.name}
                                            <BadgeCheck size={17} className="dc-verified" aria-label="Verified" />
                                        </h2>
                                        <p>{d.specialization}</p>
                                    </div>
                                    {d.rating && (
                                        <span className="dc-rating">
                                            <Star size={13} fill="currentColor" /> {Number(d.rating).toFixed(1)}
                                        </span>
                                    )}
                                </div>

                                <ul className="dc-info">
                                    {d.hospitalName && (
                                        <li><Building2 size={16} /> {d.hospitalName}</li>
                                    )}
                                    {d.location && (
                                        <li><MapPin size={16} /> {d.location}</li>
                                    )}
                                    {d.experience && (
                                        <li><GraduationCap size={16} /> {d.experience} years of experience</li>
                                    )}
                                </ul>

                                <Link to={`/doctors/${d.id}`} className="dc-btn dc-btn--soft dc-btn--block">
                                    View profile and book <ArrowRight size={16} />
                                </Link>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default Doctors;