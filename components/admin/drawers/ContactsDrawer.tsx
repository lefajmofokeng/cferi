"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import "./ContactsDrawer.css";

type Contact = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
};

interface ContactsDrawerProps {
  id?: string;
}

export default function ContactsDrawer({ id = "contacts-drawer" }: ContactsDrawerProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadContacts() {
    const supabase = createClient();
    const { data } = await supabase
      .from("personal_contacts")
      .select("id, name, phone, email, address")
      .order("name", { ascending: true });
    setContacts(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadContacts();
  }, []);

  async function handleAdd() {
    if (!name.trim()) return;
    setSaving(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("personal_contacts").insert({
      admin_id: user.id,
      name: name.trim(),
      phone: phone.trim() || null,
      email: email.trim() || null,
      address: address.trim() || null,
    });

    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setShowForm(false);
    await loadContacts();
    setSaving(false);
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from("personal_contacts").delete().eq("id", id);
    await loadContacts();
  }

  if (loading) {
    return (
      <section id={id} className="contacts-drawer">
        <p className="contacts-drawer__loading">Loading...</p>
      </section>
    );
  }

  return (
    <section id={id} className="contacts-drawer">
      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="contacts-drawer__add-btn"
        >
          <svg className="contacts-drawer__btn-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          <span>Add Contact</span>
        </button>
      ) : (
        <div className="contacts-drawer__form">
          <div className="contacts-drawer__field">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="contacts-drawer__input"
            />
          </div>
          <div className="contacts-drawer__field">
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="contacts-drawer__input"
            />
          </div>
          <div className="contacts-drawer__field">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="contacts-drawer__input"
            />
          </div>
          <div className="contacts-drawer__field">
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="contacts-drawer__input"
            />
          </div>
          <div className="contacts-drawer__form-actions">
            <button
              type="button"
              onClick={handleAdd}
              disabled={saving || !name.trim()}
              className="contacts-drawer__save-btn"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="contacts-drawer__cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="contacts-drawer__list">
        {contacts.length === 0 ? (
          <p className="contacts-drawer__empty">No contacts yet.</p>
        ) : (
          contacts.map((contact) => (
            <div key={contact.id} className="contacts-drawer__card">
              <div className="contacts-drawer__avatar">
                {contact.name.charAt(0).toUpperCase()}
              </div>
              <div className="contacts-drawer__card-details">
                <p className="contacts-drawer__card-name">{contact.name}</p>
                {contact.phone && (
                  <p className="contacts-drawer__card-info">
                    <svg className="contacts-drawer__info-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                    <span>{contact.phone}</span>
                  </p>
                )}
                {contact.email && (
                  <p className="contacts-drawer__card-info">
                    <svg className="contacts-drawer__info-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                    <span>{contact.email}</span>
                  </p>
                )}
                {contact.address && (
                  <p className="contacts-drawer__card-info">
                    <svg className="contacts-drawer__info-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <span>{contact.address}</span>
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(contact.id)}
                aria-label="Delete contact"
                title="Delete contact"
                className="contacts-drawer__delete-btn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}