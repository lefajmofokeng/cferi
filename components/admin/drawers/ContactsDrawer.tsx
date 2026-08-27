"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Contact = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
};

export default function ContactsDrawer() {
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

  if (loading) return <p className="text-gray-400 text-sm">Loading...</p>;

  return (
    <div className="space-y-4">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="bg-black text-white px-4 py-1.5 rounded text-sm hover:opacity-90"
        >
          + Add Contact
        </button>
      ) : (
        <div className="space-y-2 border border-gray-200 rounded p-3">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
          />
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={saving}
              className="bg-black text-white px-4 py-1.5 rounded text-sm hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 text-sm px-4 py-1.5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {contacts.length === 0 ? (
          <p className="text-gray-400 text-sm">No contacts yet.</p>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className="border border-gray-200 rounded p-3 text-sm flex justify-between items-start gap-2"
            >
              <div>
                <p className="font-medium">{contact.name}</p>
                {contact.phone && <p className="text-gray-500 text-xs">{contact.phone}</p>}
                {contact.email && <p className="text-gray-500 text-xs">{contact.email}</p>}
                {contact.address && <p className="text-gray-500 text-xs">{contact.address}</p>}
              </div>
              <button
                onClick={() => handleDelete(contact.id)}
                className="text-gray-300 hover:text-red-600 text-xs"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}