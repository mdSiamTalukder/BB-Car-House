
import { useState, type FormEvent } from 'react'
import { Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  const contactDetails = [
    {
      icon: Phone,
      title: 'Phone',
      detail: 'Add your showroom phone number',
    },
    {
      icon: Mail,
      title: 'Email',
      detail: 'Add your showroom email address',
    },
    {
      icon: MapPin,
      title: 'Showroom',
      detail: 'Add your showroom address',
    },
  ]

  return (
    <main className="min-h-screen bg-base-100 text-base-content">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Page Heading */}
        <div className="mb-10 border-b border-base-300 pb-7 sm:mb-12 sm:pb-9">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
            CONTACT BB CAR HOUSE
          </p>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Let’s Talk About Your{' '}
            <span className="text-emerald-600">Next Car.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-base-content/65 sm:text-base">
            Have a question about a vehicle? We’re here to help you find the
            right car for your needs.
          </p>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* Contact Information */}
          <aside className="space-y-7">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">
                Contact Information
              </h2>

              <p className="mt-3 max-w-md text-sm leading-7 text-base-content/65">
                Get in touch with us for vehicle details, pricing, or help
                choosing your next car.
              </p>
            </div>

            <div className="space-y-3">
              {contactDetails.map(({ icon: Icon, title, detail }) => (
                <div
                  key={title}
                  className="group flex items-start gap-4 rounded-xl border border-base-300 bg-base-200/20 p-4 transition-colors duration-200 hover:border-emerald-600/50 hover:bg-base-200/50 sm:p-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600 transition-colors duration-200 group-hover:bg-emerald-600 group-hover:text-white">
                    <Icon size={20} aria-hidden="true" />
                  </div>

                  <div className="min-w-0 pt-0.5">
                    <h3 className="text-sm font-bold">{title}</h3>
                    <p className="mt-1 break-words text-sm leading-6 text-base-content/65">
                      {detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border-l-4 border-emerald-600 bg-base-200/40 px-5 py-4">
              <div className="flex items-center gap-2 font-semibold">
                <MessageCircle
                  size={18}
                  className="text-emerald-600"
                  aria-hidden="true"
                />
                Need help choosing?
              </div>

              <p className="mt-2 text-sm leading-6 text-base-content/65">
                Send us your questions and let us know what kind of car
                you’re looking for.
              </p>
            </div>
          </aside>

          {/* Contact Form */}
          <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-8 lg:p-9">
            <div className="mb-7">
              <h2 className="text-xl font-bold sm:text-2xl">
                Send Us a Message
              </h2>

              <p className="mt-2 text-sm leading-6 text-base-content/65">
                Fill in the details below and tell us how we can help.
              </p>
            </div>

            {submitted && (
              <div
                role="status"
                className="mb-6 rounded-lg border border-emerald-600/30 bg-emerald-600/10 p-4 text-sm leading-6 text-base-content"
              >
                <p className="font-semibold text-emerald-600">
                  Form validated successfully!
                </p>
                <p className="mt-1 text-base-content/70">
                  This is a demo form. Your message has not been sent or saved.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} onChange={() => setSubmitted(false)}>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="form-control w-full">
                  <span className="label-text mb-2 font-semibold">
                    Your Name <span className="text-emerald-600">*</span>
                  </span>

                  <input
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    autoComplete="name"
                    className="input input-bordered w-full bg-base-200/20 outline-none transition-colors focus:border-emerald-600 focus:outline-none"
                    required
                  />
                </label>

                <label className="form-control w-full">
                  <span className="label-text mb-2 font-semibold">
                    Email Address <span className="text-emerald-600">*</span>
                  </span>

                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="input input-bordered w-full bg-base-200/20 outline-none transition-colors focus:border-emerald-600 focus:outline-none"
                    required
                  />
                </label>

                <label className="form-control w-full sm:col-span-2">
                  <span className="label-text mb-2 font-semibold">
                    Subject <span className="text-emerald-600">*</span>
                  </span>

                  <input
                    name="subject"
                    type="text"
                    placeholder="What would you like to know?"
                    className="input input-bordered w-full bg-base-200/20 outline-none transition-colors focus:border-emerald-600 focus:outline-none"
                    required
                  />
                </label>

                <label className="form-control w-full sm:col-span-2">
                  <span className="label-text mb-2 font-semibold">
                    Message <span className="text-emerald-600">*</span>
                  </span>

                  <textarea
                    name="message"
                    placeholder="Tell us how we can help..."
                    className="textarea textarea-bordered min-h-36 w-full resize-y bg-base-200/20 leading-7 outline-none transition-colors focus:border-emerald-600 focus:outline-none"
                    required
                  />
                </label>
              </div>

              <button
                type="submit"
                className="btn mt-6 w-full border-emerald-700 bg-emerald-700 text-white transition-colors duration-200 hover:border-emerald-800 hover:bg-emerald-800 sm:w-auto"
              >
                Send Message
                <Send size={16} aria-hidden="true" />
              </button>

              <p className="mt-4 text-xs leading-5 text-base-content/50">
                * Required fields
              </p>
            </form>
          </section>
        </div>
      </section>
    </main>
  )
}
