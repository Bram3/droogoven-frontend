import { json } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { PUBLIC_API } from "$env/static/public"


export const load: PageServerLoad = async ({ params, fetch }) => {

    let task = null

    const resp = await fetch(`${PUBLIC_API}/task`)
    if (resp.ok) {
        task = await resp.json()
    }
    console.log(task)

    return {
        task
    };
};


export const actions = {
    create: async (event) => {
        let data = await event.request.formData();
        let body: any = {};

        if (data.get("neverEnding") === "on") {
            body.duration = -1;
        } else {
            body.duration = Number(data.get("days")) * 86400 + Number(data.get("hours")) * 3600 + Number(data.get("minutes")) * 60;
        }
        body.temperature = parseFloat(data.get("temperature")!.toString());

        const resp = await event.fetch(`${PUBLIC_API}/task`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" }
        });

        if (resp.ok) {
            console.log(await resp.json());
        } else {
            console.error('Failed to post task:', await resp.text());
        }
    },
    update: async (event) => {
        let data = await event.request.formData();
        let body: any = {};

        if (data.get("neverEnding") === "on") {
            body.duration = -1;
        } else {
            body.duration = Number(data.get("days")) * 86400 + Number(data.get("hours")) * 3600 + Number(data.get("minutes")) * 60;
        }
        body.temperature = parseFloat(data.get("temperature")!.toString());

        const resp = await event.fetch(`${PUBLIC_API}/task`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" }
        });

        if (resp.ok) {
            return await resp.json()
        } else {
            console.error('Failed to post task:', await resp.text());
        }
    },
    stop: async (event) => {
        const resp = await event.fetch(`${PUBLIC_API}/task`, {
            method: "DELETE",
        });
    }
} satisfies Actions;